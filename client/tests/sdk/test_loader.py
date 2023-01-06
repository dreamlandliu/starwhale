import os
import shutil
import typing as t
import tempfile
from unittest.mock import patch, MagicMock

from requests_mock import Mocker
from pyfakefs.fake_filesystem_unittest import TestCase

from tests import ROOT_DIR
from starwhale import MIMEType, get_data_loader
from starwhale.utils import config
from starwhale.consts import HTTPMethod, SWDSBackendType
from starwhale.base.uri import URI
from starwhale.utils.fs import ensure_dir
from starwhale.base.type import URIType, DataFormatType, DataOriginType, ObjectStoreType
from starwhale.consts.env import SWEnv
from starwhale.utils.error import ParameterError
from starwhale.core.dataset.type import Link, Image, ArtifactType, DatasetSummary
from starwhale.core.dataset.store import (
    S3Connection,
    DatasetStorage,
    SignedUrlBackend,
    LocalFSStorageBackend,
)
from starwhale.api._impl.data_store import SwObject, RemoteDataStore
from starwhale.core.dataset.tabular import (
    StandaloneTDSC,
    TabularDatasetRow,
    get_dataset_consumption,
)
from starwhale.api._impl.dataset.loader import (
    DataRow,
    DataLoader,
    SWDSBinDataLoader,
    UserRawDataLoader,
)


class TestDataLoader(TestCase):
    def setUp(self) -> None:
        self.setUpPyfakefs()
        self.dataset_uri = URI("mnist/version/1122334455667788", URIType.DATASET)
        self.swds_dir = os.path.join(ROOT_DIR, "data", "dataset", "swds")
        self.fs.add_real_directory(self.swds_dir)

    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.wrapper.Dataset.scan_id")
    def test_range_match(self, m_scan_id: MagicMock, m_summary: MagicMock) -> None:
        m_summary.return_value = DatasetSummary(
            include_user_raw=True,
            include_link=False,
        )
        m_scan_id.return_value = [{"id": "path/0"}]
        consumption = get_dataset_consumption(
            self.dataset_uri,
            session_id="10",
            session_start="path/0",
            session_end=None,
        )
        with self.assertRaises(ParameterError):
            get_data_loader(self.dataset_uri, session_consumption=consumption)

        with self.assertRaises(ParameterError):
            get_data_loader(
                self.dataset_uri, session_consumption=consumption, start="path/1"
            )

        with self.assertRaises(ParameterError):
            get_data_loader(
                self.dataset_uri, session_consumption=consumption, end="path/1"
            )

    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.wrapper.Dataset.scan_id")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_user_raw_local_store(
        self, m_scan: MagicMock, m_scan_id: MagicMock, m_summary: MagicMock
    ) -> None:
        m_summary.return_value = DatasetSummary(
            include_user_raw=True,
            include_link=False,
        )
        m_scan_id.return_value = [{"id": "path/0"}]

        consumption = get_dataset_consumption(self.dataset_uri, session_id="1")
        loader = get_data_loader(self.dataset_uri, session_consumption=consumption)
        assert isinstance(loader, UserRawDataLoader)
        assert isinstance(loader.session_consumption, StandaloneTDSC)

        fname = "data"
        m_scan.return_value = [
            TabularDatasetRow(
                id="path/0",
                object_store_type=ObjectStoreType.LOCAL,
                data_link=Link(fname),
                data_offset=16,
                data_size=784,
                annotations={"label": 0},
                data_origin=DataOriginType.NEW,
                data_format=DataFormatType.UNDEFINED,
                data_type={
                    "type": ArtifactType.Image.value,
                    "mime_type": MIMEType.GRAYSCALE.value,
                },
            )
        ]

        raw_data_fpath = os.path.join(ROOT_DIR, "data", "dataset", "mnist", "data")
        self.fs.add_real_file(raw_data_fpath)
        data_dir = DatasetStorage(self.dataset_uri).data_dir
        ensure_dir(data_dir)
        shutil.copy(raw_data_fpath, str(data_dir / fname))

        assert loader._stores == {}

        rows = list(loader)
        assert len(rows) == 1

        _idx, _data, _annotations = rows[0]
        assert _idx == "path/0"
        assert _annotations["label"] == 0

        assert len(_data.to_bytes()) == 28 * 28
        assert isinstance(_data, Image)

        assert loader.kind == DataFormatType.USER_RAW
        assert list(loader._stores.keys()) == [
            "local/project/self/dataset/mnist/version/1122334455667788."
        ]
        assert loader._stores[
            "local/project/self/dataset/mnist/version/1122334455667788."
        ].bucket == str(data_dir)
        assert (
            loader._stores[
                "local/project/self/dataset/mnist/version/1122334455667788."
            ].backend.kind
            == SWDSBackendType.LocalFS
        )
        assert not loader._stores[
            "local/project/self/dataset/mnist/version/1122334455667788."
        ].key_prefix

        loader = get_data_loader("mnist/version/1122334455667788")
        assert isinstance(loader, UserRawDataLoader)
        assert loader.session_consumption is None
        rows = list(loader)
        assert len(rows) == 1

        _idx, _, _annotations = rows[0]
        assert _idx == "path/0"
        assert _annotations["label"] == 0

    @patch.dict(os.environ, {})
    @patch("starwhale.core.dataset.store.boto3.resource")
    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.wrapper.Dataset.scan_id")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_user_raw_remote_store(
        self,
        m_scan: MagicMock,
        m_scan_id: MagicMock,
        m_summary: MagicMock,
        m_boto3: MagicMock,
    ) -> None:
        with tempfile.TemporaryDirectory() as tmpdirname:
            config._config = {}
            os.environ["SW_CLI_CONFIG"] = tmpdirname + "/config.yaml"
            m_summary.return_value = DatasetSummary(
                include_user_raw=True,
                include_link=True,
            )
            m_scan_id.return_value = [{"id": i} for i in range(0, 4)]

            snapshot_workdir = DatasetStorage(self.dataset_uri).snapshot_workdir
            ensure_dir(snapshot_workdir)
            config.update_swcli_config(
                **{
                    "link_auths": [
                        {
                            "type": "s3",
                            "ak": "11",
                            "sk": "11",
                            "bucket": "starwhale",
                            "endpoint": "http://127.0.0.1:9000",
                        },
                        {
                            "type": "s3",
                            "ak": "11",
                            "sk": "11",
                            "endpoint": "http://127.0.0.1:19000",
                            "bucket": "starwhale",
                        },
                        {
                            "type": "s3",
                            "ak": "11",
                            "sk": "11",
                            "endpoint": "http://127.0.0.1",
                            "bucket": "starwhale",
                        },
                    ]
                }
            )
            S3Connection.connections_config = []

            consumption = get_dataset_consumption(self.dataset_uri, session_id="2")
            loader = get_data_loader(self.dataset_uri, session_consumption=consumption)
            assert isinstance(loader, UserRawDataLoader)
            assert isinstance(loader.session_consumption, StandaloneTDSC)
            assert loader.session_consumption._todo_queue.qsize() == 1
            assert loader.kind == DataFormatType.USER_RAW

            version = "1122334455667788"

            m_scan.return_value = [
                TabularDatasetRow(
                    id=0,
                    object_store_type=ObjectStoreType.REMOTE,
                    data_link=Link(
                        f"s3://127.0.0.1:9000/starwhale/project/2/dataset/11/{version}"
                    ),
                    data_offset=16,
                    data_size=784,
                    annotations={"label": 0},
                    data_origin=DataOriginType.NEW,
                    data_format=DataFormatType.USER_RAW,
                    data_type={
                        "type": ArtifactType.Image.value,
                        "mime_type": MIMEType.GRAYSCALE.value,
                    },
                ),
                TabularDatasetRow(
                    id=1,
                    object_store_type=ObjectStoreType.REMOTE,
                    data_link=Link(
                        f"s3://127.0.0.1:19000/starwhale/project/2/dataset/11/{version}"
                    ),
                    data_offset=16,
                    data_size=784,
                    annotations={"label": 1},
                    data_origin=DataOriginType.NEW,
                    data_format=DataFormatType.USER_RAW,
                    data_type={
                        "type": ArtifactType.Image.value,
                        "mime_type": MIMEType.GRAYSCALE.value,
                    },
                ),
                TabularDatasetRow(
                    id=2,
                    object_store_type=ObjectStoreType.REMOTE,
                    data_link=Link(
                        f"s3://127.0.0.1/starwhale/project/2/dataset/11/{version}"
                    ),
                    data_offset=16,
                    data_size=784,
                    annotations={"label": 1},
                    data_origin=DataOriginType.NEW,
                    data_format=DataFormatType.USER_RAW,
                    data_type={
                        "type": ArtifactType.Image.value,
                        "mime_type": MIMEType.GRAYSCALE.value,
                    },
                ),
                TabularDatasetRow(
                    id=3,
                    object_store_type=ObjectStoreType.REMOTE,
                    data_link=Link(
                        f"s3://username:password@127.0.0.1:29000/starwhale/project/2/dataset/11/{version}"
                    ),
                    data_offset=16,
                    data_size=784,
                    annotations={"label": 1},
                    data_origin=DataOriginType.NEW,
                    data_format=DataFormatType.USER_RAW,
                    data_type={
                        "type": ArtifactType.Image.value,
                        "mime_type": MIMEType.GRAYSCALE.value,
                    },
                ),
            ]

            raw_data_fpath = os.path.join(ROOT_DIR, "data", "dataset", "mnist", "data")
            self.fs.add_real_file(raw_data_fpath)
            with open(raw_data_fpath, "rb") as f:
                raw_content = f.read(-1)

            m_boto3.return_value = MagicMock(
                **{
                    "Object.return_value": MagicMock(
                        **{
                            "get.return_value": {
                                "Body": MagicMock(**{"read.return_value": raw_content}),
                                "ContentLength": len(raw_content),
                            }
                        }
                    )
                }
            )

            assert loader.kind == DataFormatType.USER_RAW
            assert loader._stores == {}

            rows = list(loader)
            assert len(rows) == 4

            _idx, _data, _annotations = rows[0]
            assert _idx == 0
            assert _annotations["label"] == 0
            assert isinstance(_data, Image)

            assert len(_data.to_bytes()) == 28 * 28
            assert isinstance(_data.to_bytes(), bytes)
            assert len(loader._stores) == 4
            assert (
                loader._stores[
                    "local/project/self/dataset/mnist/version/1122334455667788.s3://127.0.0.1/starwhale/"
                ].backend.kind
                == SWDSBackendType.S3
            )
            assert (
                loader._stores[
                    "local/project/self/dataset/mnist/version/1122334455667788.s3://127.0.0.1:9000/starwhale/"
                ].bucket
                == "starwhale"
            )

            loader = get_data_loader(self.dataset_uri)
            assert isinstance(loader, UserRawDataLoader)
            assert loader.session_consumption is None
            assert len(list(loader)) == 4

    @Mocker()
    @patch("starwhale.core.dataset.model.CloudDataset.summary")
    @patch("starwhale.api._impl.wrapper.Dataset.scan_id")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_swds_bin_s3(
        self,
        rm: Mocker,
        m_scan: MagicMock,
        m_scan_id: MagicMock,
        m_summary: MagicMock,
    ) -> None:
        m_summary.return_value = DatasetSummary(
            include_user_raw=False,
            include_link=False,
        )
        m_scan_id.return_value = [{"id": 0}]
        version = "1122334455667788"
        dataset_uri = URI(
            f"http://127.0.0.1:1234/project/self/dataset/mnist/version/{version}",
            expected_type=URIType.DATASET,
        )

        os.environ[SWEnv.instance_token] = "123"
        consumption = get_dataset_consumption(self.dataset_uri, session_id="5")
        loader = get_data_loader(dataset_uri, session_consumption=consumption)
        assert isinstance(loader, SWDSBinDataLoader)
        assert loader.kind == DataFormatType.SWDS_BIN
        assert isinstance(loader.session_consumption, StandaloneTDSC)
        assert isinstance(
            loader.tabular_dataset._ds_wrapper._data_store, RemoteDataStore
        )

        fname = "data_ubyte_0.swds_bin"
        m_scan.return_value = [
            TabularDatasetRow(
                id=0,
                object_store_type=ObjectStoreType.LOCAL,
                data_link=Link(fname),
                data_offset=32,
                data_size=784,
                _swds_bin_offset=0,
                _swds_bin_size=8160,
                annotations={"label": 0},
                data_origin=DataOriginType.NEW,
                data_format=DataFormatType.SWDS_BIN,
                data_type={
                    "type": ArtifactType.Image.value,
                    "mime_type": MIMEType.GRAYSCALE.value,
                },
            )
        ]
        os.environ.update(
            {
                "SW_S3_BUCKET": "starwhale",
                "SW_S3_ENDPOINT": "starwhale.mock:9000",
                "SW_S3_ACCESS_KEY": "foo",
                "SW_S3_SECRET": "bar",
            }
        )

        with open(os.path.join(self.swds_dir, fname), "rb") as f:
            swds_content = f.read(-1)

        signed_url = "http://minio/signed/path/file"
        rm.post(
            "http://127.0.0.1:1234/api/v1/project/self/dataset/mnist/version/1122334455667788/sign-links",
            json={"data": {fname: signed_url}},
        )
        rm.get(
            signed_url,
            content=swds_content,
        )

        assert loader._stores == {}

        rows = list(loader)
        assert len(rows) == 1
        _idx, _data, _annotations = rows[0]
        assert _idx == 0
        assert _annotations["label"] == 0

        assert len(_data.to_bytes()) == 10 * 28 * 28
        assert isinstance(_data, Image)

        assert list(loader._stores.keys()) == [
            "http://127.0.0.1:1234/project/self/dataset/mnist/version/1122334455667788."
        ]
        backend = loader._stores[
            "http://127.0.0.1:1234/project/self/dataset/mnist/version/1122334455667788."
        ].backend
        assert isinstance(backend, SignedUrlBackend)
        assert backend.kind == SWDSBackendType.SignedUrl

        assert (
            loader._stores[
                "http://127.0.0.1:1234/project/self/dataset/mnist/version/1122334455667788."
            ].bucket
            == ""
        )
        assert (
            loader._stores[
                "http://127.0.0.1:1234/project/self/dataset/mnist/version/1122334455667788."
            ].key_prefix
            == ""
        )

    @patch.dict(os.environ, {})
    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_swds_bin_local_fs(self, m_scan: MagicMock, m_summary: MagicMock) -> None:
        m_summary.return_value = DatasetSummary(
            include_user_raw=False,
            include_link=False,
            rows=2,
            increased_rows=2,
        )
        loader = get_data_loader(self.dataset_uri)
        assert isinstance(loader, SWDSBinDataLoader)
        assert loader.kind == DataFormatType.SWDS_BIN

        fname = "data_ubyte_0.swds_bin"
        m_scan.return_value = [
            TabularDatasetRow(
                id=0,
                object_store_type=ObjectStoreType.LOCAL,
                data_link=Link(fname),
                data_offset=32,
                data_size=784,
                _swds_bin_offset=0,
                _swds_bin_size=8160,
                annotations={"label": 0},
                data_origin=DataOriginType.NEW,
                data_format=DataFormatType.SWDS_BIN,
                data_type={
                    "type": ArtifactType.Image.value,
                    "mime_type": MIMEType.GRAYSCALE.value,
                },
            ),
            TabularDatasetRow(
                id=1,
                object_store_type=ObjectStoreType.LOCAL,
                data_link=Link(fname),
                data_offset=32,
                data_size=784,
                _swds_bin_offset=0,
                _swds_bin_size=8160,
                annotations={"label": 1},
                data_origin=DataOriginType.NEW,
                data_format=DataFormatType.SWDS_BIN,
                data_type={
                    "type": ArtifactType.Image.value,
                    "mime_type": MIMEType.GRAYSCALE.value,
                },
            ),
        ]

        data_dir = DatasetStorage(self.dataset_uri).data_dir
        ensure_dir(data_dir)
        shutil.copyfile(os.path.join(self.swds_dir, fname), str(data_dir / fname))
        assert loader._stores == {}

        rows = list(loader)
        assert len(rows) == 2

        _idx, _data, _annotations = rows[0]

        assert _idx == 0
        assert _annotations["label"] == 0

        assert isinstance(_data, Image)
        assert len(_data.to_bytes()) == 7840
        assert isinstance(_data.to_bytes(), bytes)

        assert list(loader._stores.keys()) == [
            "local/project/self/dataset/mnist/version/1122334455667788."
        ]
        backend = loader._stores[
            "local/project/self/dataset/mnist/version/1122334455667788."
        ].backend
        assert isinstance(backend, LocalFSStorageBackend)
        assert backend.kind == SWDSBackendType.LocalFS
        assert loader._stores[
            "local/project/self/dataset/mnist/version/1122334455667788."
        ].bucket == str(data_dir)
        assert not loader._stores[
            "local/project/self/dataset/mnist/version/1122334455667788."
        ].key_prefix

    @Mocker()
    @patch.dict(os.environ, {"SW_TOKEN": "a", "SW_POD_NAME": "b"})
    @patch("starwhale.core.dataset.model.CloudDataset.summary")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan_batch")
    @patch("starwhale.core.dataset.tabular.TabularDatasetSessionConsumption")
    def test_remote_batch_sign(
        self,
        rm: Mocker,
        m_sc: MagicMock,
        m_scan_batch: MagicMock,
        m_summary: MagicMock,
    ) -> None:
        m_summary.return_value = DatasetSummary(
            include_user_raw=True,
            include_link=False,
        )
        tdsc = m_sc()
        tdsc.get_scan_range.side_effect = [["a", "d"], None]
        tdsc.batch_size = 20
        tdsc.session_start = "a"
        tdsc.session_end = "d"
        dataset_uri = URI(
            "http://localhost/project/x/dataset/mnist/version/1122",
            URIType.DATASET,
        )
        m_scan_batch.return_value = [
            [
                TabularDatasetRow(
                    id="a",
                    object_store_type=ObjectStoreType.LOCAL,
                    data_link=Link("l11"),
                    data_offset=32,
                    data_size=784,
                    _swds_bin_offset=0,
                    _swds_bin_size=8160,
                    annotations={"label": Link("l1")},
                    data_origin=DataOriginType.NEW,
                    data_format=DataFormatType.SWDS_BIN,
                    data_type={
                        "type": ArtifactType.Image.value,
                        "mime_type": MIMEType.GRAYSCALE.value,
                    },
                ),
                TabularDatasetRow(
                    id="b",
                    object_store_type=ObjectStoreType.LOCAL,
                    data_link=Link("l12"),
                    data_offset=32,
                    data_size=784,
                    _swds_bin_offset=0,
                    _swds_bin_size=8160,
                    annotations={"label": Link("l2")},
                    data_origin=DataOriginType.NEW,
                    data_format=DataFormatType.SWDS_BIN,
                    data_type={
                        "type": ArtifactType.Image.value,
                        "mime_type": MIMEType.GRAYSCALE.value,
                    },
                ),
            ],
            [
                TabularDatasetRow(
                    id="c",
                    object_store_type=ObjectStoreType.LOCAL,
                    data_link=Link("l13"),
                    data_offset=32,
                    data_size=784,
                    _swds_bin_offset=0,
                    _swds_bin_size=8160,
                    annotations={"label": Link("l3")},
                    data_origin=DataOriginType.NEW,
                    data_format=DataFormatType.SWDS_BIN,
                    data_type={
                        "type": ArtifactType.Image.value,
                        "mime_type": MIMEType.GRAYSCALE.value,
                    },
                ),
                TabularDatasetRow(
                    id="d",
                    object_store_type=ObjectStoreType.LOCAL,
                    data_link=Link("l14"),
                    data_offset=32,
                    data_size=784,
                    _swds_bin_offset=0,
                    _swds_bin_size=8160,
                    annotations={"label": Link("l4")},
                    data_origin=DataOriginType.NEW,
                    data_format=DataFormatType.SWDS_BIN,
                    data_type={
                        "type": ArtifactType.Image.value,
                        "mime_type": MIMEType.GRAYSCALE.value,
                    },
                ),
            ],
        ]

        _uri_dict = {
            "l1": "http://l1/get-file",
            "l2": "http://l2/get-file",
            "l3": "http://l3/get-file",
            "l4": "http://l4/get-file",
            "l11": "http://l11/get-file",
            "l12": "http://l12/get-file",
            "l13": "http://l13/get-file",
            "l14": "http://l14/get-file",
        }

        raw_content = b"abcdefg"
        req_get_file = rm.register_uri(HTTPMethod.GET, "/get-file", content=raw_content)
        rm.post(
            "http://localhost/api/v1/project/x/dataset/mnist/version/1122/sign-links",
            json={"data": _uri_dict},
        )

        loader = get_data_loader(
            dataset_uri, start="a", end="d", session_consumption=tdsc
        )
        _label_uris_map = {}
        for _, data, annotations in loader:
            self.assertEqual(raw_content, data.to_bytes())
            _label_uris_map[annotations["label"].uri] = annotations["label"]._signed_uri
            self.assertEqual(
                annotations["label"]._signed_uri,
                _uri_dict.get(annotations["label"].uri),
            )

        self.assertEqual(req_get_file.call_count, 4)
        self.assertEqual(len(_label_uris_map), 4)

    def test_data_row(self) -> None:
        dr = DataRow(index=1, data=Image(), annotations={"label": 1})
        index, data, annotations = dr
        assert index == 1
        assert isinstance(data, Image)
        assert annotations == {"label": 1}
        assert dr[0] == 1
        assert len(dr) == 3

        dr_another = DataRow(index=2, data=Image(), annotations={"label": 2})
        assert dr < dr_another
        assert dr != dr_another

        dr_third = DataRow(index=1, data=Image(fp=b""), annotations={"label": 10})
        assert dr >= dr_third

        dr_none = DataRow(index=1, data=None, annotations={})
        assert dr_none.data is None

    def test_data_row_exceptions(self) -> None:
        with self.assertRaises(TypeError):
            DataRow(index=b"", data=Image(), annotations={})  # type: ignore

        with self.assertRaises(TypeError):
            DataRow(index=1, data=b"", annotations={})  # type: ignore

        with self.assertRaises(TypeError):
            DataRow(index=1, data=Image(), annotations=1)  # type: ignore

    def test_travel_link(self) -> None:
        class _SW(SwObject):
            def __init__(self) -> None:
                self.link = Link()

        objs = {
            "link": Link(),
            "dict": {
                "link": Link(),
            },
            "list": [Link(), Link()],
            "tuple": (Link(),),
            "list_complex": [[Link()], (Link()), {"link": Link()}],
            "sw_object": _SW(),
        }

        links = DataLoader._travel_link(objs)
        assert len(links) == 9

    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_loader_with_cache(self, m_scan: MagicMock, m_summary: MagicMock) -> None:
        rows_cnt = 100
        m_summary.return_value = DatasetSummary(
            rows=rows_cnt,
            increased_rows=rows_cnt,
        )
        fname = "data_ubyte_0.swds_bin"
        m_scan.return_value = [
            TabularDatasetRow(
                id=i,
                data_link=Link(fname),
                data_offset=32,
                data_size=784,
                _swds_bin_offset=0,
                _swds_bin_size=8160,
                annotations={"label": i},
            )
            for i in range(0, rows_cnt)
        ]
        data_dir = DatasetStorage(self.dataset_uri).data_dir
        ensure_dir(data_dir)
        shutil.copyfile(os.path.join(self.swds_dir, fname), str(data_dir / fname))

        loader = get_data_loader(self.dataset_uri, cache_size=50, num_workers=4)
        assert len(list(loader)) == rows_cnt

        loader = get_data_loader(self.dataset_uri, cache_size=100, num_workers=10)
        assert len(list(loader)) == rows_cnt

        loader = get_data_loader(self.dataset_uri, cache_size=1, num_workers=1)
        assert len(list(loader)) == rows_cnt

        with self.assertRaisesRegex(ValueError, "must be a positive int number"):
            get_data_loader(self.dataset_uri, cache_size=0)

        with self.assertRaisesRegex(ValueError, "must be a positive int number"):
            get_data_loader(self.dataset_uri, num_workers=0)

    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_loader_with_scan_exception(
        self, m_scan: MagicMock, m_summary: MagicMock
    ) -> None:
        m_summary.return_value = DatasetSummary(
            rows=1,
            increased_rows=1,
        )

        def _scan_exception(*args: t.Any, **kwargs: t.Any) -> t.Any:
            raise RuntimeError("scan error")

        m_scan.side_effect = _scan_exception

        with self.assertRaisesRegex(RuntimeError, "scan error"):
            loader = get_data_loader(self.dataset_uri)
            [d.index for d in loader]

    @patch("starwhale.core.dataset.model.StandaloneDataset.summary")
    @patch("starwhale.api._impl.dataset.loader.TabularDataset.scan")
    def test_loader_with_makefile_exception(
        self, m_scan: MagicMock, m_summary: MagicMock
    ) -> None:
        m_summary.return_value = DatasetSummary(
            rows=1,
            increased_rows=1,
        )

        m_scan.return_value = [
            TabularDatasetRow(
                id=0,
                data_link=Link("not-found"),
                data_offset=32,
                data_size=784,
                _swds_bin_offset=0,
                _swds_bin_size=8160,
                annotations={"label": 0},
            )
        ]
        loader = get_data_loader(self.dataset_uri)
        with self.assertRaises(FileNotFoundError):
            [d.index for d in loader]
