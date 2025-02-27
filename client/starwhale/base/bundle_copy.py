import os
import typing as t
from http import HTTPStatus
from pathlib import Path
from concurrent.futures import wait, ThreadPoolExecutor

import yaml
from rich.progress import (
    TaskID,
    Progress,
    BarColumn,
    TextColumn,
    SpinnerColumn,
    TimeElapsedColumn,
    TotalFileSizeColumn,
    TransferSpeedColumn,
)

from starwhale.utils import console, now_str, load_yaml
from starwhale.consts import (
    FileDesc,
    FileNode,
    HTTPMethod,
    CREATED_AT_KEY,
    VERSION_PREFIX_CNT,
    STANDALONE_INSTANCE,
    DEFAULT_MANIFEST_NAME,
)
from starwhale.base.tag import StandaloneTag
from starwhale.base.uri import URI
from starwhale.utils.fs import ensure_dir, ensure_file
from starwhale.base.type import URIType, InstanceType, get_bundle_type_by_uri
from starwhale.base.cloud import CloudRequestMixed
from starwhale.utils.error import NotFoundError, NoSupportError, FieldTypeOrValueError
from starwhale.utils.config import SWCliConfigMixed
from starwhale.base.blob.store import LocalFileStore
from starwhale.core.model.store import ModelStorage
from starwhale.core.dataset.store import DatasetStorage
from starwhale.core.runtime.store import RuntimeStorage
from starwhale.base.uricomponents.project import Project
from starwhale.base.uricomponents.resource import Resource, ResourceType

TMP_FILE_BUFSIZE = 8192

_query_param_map = {
    URIType.DATASET: "swds",
    URIType.MODEL: "swmp",
    URIType.RUNTIME: "runtime",
}


class _UploadPhase:
    MANIFEST = "MANIFEST"
    BLOB = "BLOB"
    END = "END"
    CANCEL = "CANCEL"


class BundleCopy(CloudRequestMixed):
    def __init__(
        self,
        src_uri: str,
        dest_uri: str,
        typ: str,
        force: bool = False,
        **kw: t.Any,
    ) -> None:
        self.src_resource = Resource(src_uri, typ=ResourceType[typ])
        self.src_uri = self.src_resource.to_uri()
        if self.src_uri.instance_type == InstanceType.CLOUD:
            p = kw.get("dest_local_project_uri")
            project = p and Project(p) or None
            dest_uri = self.src_uri.object.name if dest_uri.strip() == "." else dest_uri
        else:
            project = None

        try:
            self.dest_uri = Resource(
                dest_uri, typ=ResourceType[typ], project=project
            ).to_uri()
        except Exception as e:
            if str(e).startswith("invalid uri"):
                self.dest_uri = Project(dest_uri).to_uri()
            else:
                raise

        self.typ = typ
        self.force = force
        self.bundle_name = self.src_uri.object.name
        self.bundle_version = self._guess_bundle_version()
        self.field_flag = _query_param_map[self.typ]
        self.field_value = f"{self.bundle_name}:{self.bundle_version}"

        self.kw = kw

        self._sw_config = SWCliConfigMixed()
        self._do_validate()
        self._object_store = LocalFileStore()

    def _guess_bundle_version(self) -> str:
        if self.src_uri.instance_type == InstanceType.CLOUD:
            return self.src_uri.object.version
        else:
            if self.typ == URIType.DATASET:
                _v = DatasetStorage(self.src_uri).id
            elif self.typ == URIType.MODEL:
                _v = ModelStorage(self.src_uri).id
            elif self.typ == URIType.RUNTIME:
                _v = RuntimeStorage(self.src_uri).id
            else:
                raise NoSupportError(self.typ)

            return _v or self.src_uri.object.version

    def _do_validate(self) -> None:
        if self.typ not in (URIType.DATASET, URIType.MODEL, URIType.RUNTIME):
            raise NoSupportError(f"{self.typ} copy does not work")

        if self.bundle_version == "":
            raise Exception(f"must specify version src:({self.bundle_version})")

    def _check_cloud_obj_existed(self, instance_uri: URI) -> bool:
        # TODO: add more params for project
        # TODO: tune controller api, use unified params name
        ok, _ = self.do_http_request_simple_ret(
            path=self._get_remote_bundle_api_url(for_head=True),
            method=HTTPMethod.HEAD,
            instance_uri=instance_uri,
            ignore_status_codes=[HTTPStatus.NOT_FOUND],
        )
        return ok

    def _get_versioned_resource_path(self, uri: URI) -> Path:
        if uri.instance_type != InstanceType.STANDALONE:
            raise NoSupportError(f"{uri} to get target dir path")

        resource_name = uri.object.name or self.bundle_name
        return (
            self._sw_config.rootdir
            / uri.project
            / self.typ
            / resource_name
            / self.bundle_version[:VERSION_PREFIX_CNT]
            / f"{self.bundle_version}{get_bundle_type_by_uri(self.typ)}"
        )

    def _check_version_existed(self, uri: URI) -> bool:
        if uri.instance_type == InstanceType.CLOUD:
            return self._check_cloud_obj_existed(uri)
        else:
            return self._get_versioned_resource_path(uri).exists()

    def _get_remote_bundle_console_url(self, with_version: bool = True) -> str:
        if self.src_uri.instance_type == InstanceType.CLOUD:
            remote = self.src_uri
            resource_name = self.src_uri.object.name
        else:
            remote = self.dest_uri
            resource_name = self.dest_uri.object.name or self.src_uri.object.name

        url = f"{remote.instance}/projects/{remote.project}/{self.typ}s/{resource_name}"
        if with_version:
            url = f"{url}/versions/{self.src_uri.object.version}/overview"
        return url

    def _get_remote_bundle_api_url(self, for_head: bool = False) -> str:
        version = self.src_uri.object.version
        if not version:
            raise FieldTypeOrValueError(
                f"cannot fetch version from src uri:{self.src_uri}"
            )

        if self.src_uri.instance_type == InstanceType.CLOUD:
            project = self.src_uri.project
            resource_name = self.src_uri.object.name
        else:
            project = self.dest_uri.project
            resource_name = self.dest_uri.object.name or self.src_uri.object.name

        if not resource_name:
            raise FieldTypeOrValueError(
                f"cannot fetch {self.typ} resource name from src_uri({self.src_uri}) or dest_uri({self.dest_uri})"
            )

        base = [f"/project/{project}/{self.typ}/{resource_name}/version/{version}"]
        if not for_head:
            # uri for head request contains no 'file'
            base.append("file")

        return "/".join(base)

    def _do_upload_bundle_tar(self, progress: Progress) -> None:
        file_path = self._get_versioned_resource_path(self.src_uri)
        task_id = progress.add_task(
            f":bowling: upload {file_path.name}",
            total=file_path.stat().st_size,
        )

        self.do_multipart_upload_file(
            url_path=self._get_remote_bundle_api_url(),
            file_path=file_path,
            instance_uri=self.dest_uri,
            fields={
                self.field_flag: self.field_value,
                "project": self.dest_uri.project,
                "force": "1" if self.force else "0",
            },
            use_raise=True,
            progress=progress,
            task_id=task_id,
        )

    def _do_download_bundle_tar(self, progress: Progress) -> None:
        file_path = self._get_versioned_resource_path(self.dest_uri)
        ensure_dir(os.path.dirname(file_path))
        task_id = progress.add_task(f":bowling: download to {file_path}...")

        self.do_download_file(
            url_path=self._get_remote_bundle_api_url(),
            dest_path=file_path,
            instance_uri=self.src_uri,
            params={
                self.field_flag: self.field_value,
                "project": self.src_uri.project,
            },
            progress=progress,
            task_id=task_id,
        )

    def do(self) -> None:
        remote_url = self._get_remote_bundle_console_url()
        if self._check_version_existed(self.dest_uri) and not self.force:
            console.print(f":tea: {remote_url} was already existed, skip copy")
            return

        if not self._check_version_existed(self.src_uri):
            raise NotFoundError(str(self.src_uri))

        console.print(f":construction: start to copy {self.src_uri} -> {self.dest_uri}")

        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
            TimeElapsedColumn(),
            TotalFileSizeColumn(),
            TransferSpeedColumn(),
            console=console,
            refresh_per_second=0.2,
        ) as progress:
            if self.src_uri.instance_type == InstanceType.STANDALONE:
                if self.typ == URIType.MODEL:
                    self._do_upload_bundle_dir(progress)
                elif self.typ == URIType.RUNTIME:
                    self._do_upload_bundle_tar(progress)
                else:
                    raise NoSupportError(
                        f"no support to copy {self.typ} from standalone to server"
                    )
            else:
                if self.typ == URIType.MODEL:
                    self._do_download_bundle_dir(progress)
                elif self.typ == URIType.RUNTIME:
                    self._do_download_bundle_tar(progress)
                else:
                    raise NoSupportError(
                        f"no support to copy {self.typ} from server to standalone"
                    )

                _dest_uri = URI.capsulate_uri(
                    instance=STANDALONE_INSTANCE,
                    project=self.dest_uri.project,
                    obj_type=self.typ,
                    obj_name=self.dest_uri.object.name or self.bundle_name,
                    obj_ver=self.bundle_version,
                )
                StandaloneTag(_dest_uri).add_fast_tag()
                self._update_manifest(
                    self._get_versioned_resource_path(_dest_uri),
                    {CREATED_AT_KEY: now_str()},
                )
        console.print(f":tea: console url of the remote bundle: {remote_url}")

    def upload_files(self, workdir: Path) -> t.Iterator[FileNode]:
        raise NotImplementedError

    def download_files(self, workdir: Path) -> t.Iterator[FileNode]:
        raise NotImplementedError

    def _do_download_bundle_dir(self, progress: Progress) -> None:
        _workdir = self._get_versioned_resource_path(self.dest_uri)

        def _download(_tid: TaskID, fd: FileNode) -> None:
            if fd.signature:
                f = self._object_store.get(fd.signature)
                if f is not None and f.exists():
                    f.link(_workdir / fd.path / fd.name)
                    progress.update(_tid, completed=fd.size)
                    return

            self.do_download_file(
                # TODO: use /project/{self.typ}/pull api
                url_path=self._get_remote_bundle_api_url(),
                dest_path=fd.path,
                instance_uri=self.src_uri,
                params={
                    "desc": fd.file_desc.name,
                    "partName": fd.name,
                    "signature": fd.signature,
                },
                progress=progress,
                task_id=_tid,
            )
            # put the downloaded file to object store for cache usage
            self._object_store.link(fd.path, fd.signature)

        _manifest_path = _workdir / DEFAULT_MANIFEST_NAME
        _tid = progress.add_task(f":arrow_down: {DEFAULT_MANIFEST_NAME}")
        _download(
            _tid,
            FileNode(
                path=_manifest_path,
                name=DEFAULT_MANIFEST_NAME,
                signature="",
                file_desc=FileDesc.MANIFEST,
                size=0,
            ),
        )

        for _f in self.download_files(workdir=_workdir):
            _tid = progress.add_task(
                f":arrow_down: {_f.name}",
                total=float(_f.size),
            )
            if not _f.path.exists() or self.force:
                _download(_tid, _f)

    def _do_ubd_bundle_prepare(
        self,
        progress: t.Optional[Progress],
        workdir: Path,
        url_path: str,
    ) -> t.Any:
        manifest_path = workdir / DEFAULT_MANIFEST_NAME
        if progress is None:
            task_id = TaskID(0)
        else:
            task_id = progress.add_task(
                f":arrow_up: {manifest_path.name}",
                total=manifest_path.stat().st_size,
            )

        # TODO: use rich progress
        r = self.do_multipart_upload_file(
            url_path=url_path,
            file_path=manifest_path,
            instance_uri=self.dest_uri,
            params={
                self.field_flag: self.field_value,
                "phase": _UploadPhase.MANIFEST,
                "desc": FileDesc.MANIFEST.name,
                "project": self.dest_uri.project,
                "force": "1" if self.force else "0",
            },
            use_raise=True,
            progress=progress,
            task_id=task_id,
        )
        return r.json().get("data", {})

    def _do_ubd_blobs(
        self,
        progress: t.Optional[Progress],
        workdir: Path,
        upload_id: str,
        url_path: str,
        existed_files: t.Optional[t.List] = None,
    ) -> None:
        existed_files = existed_files or []

        # TODO: add retry deco
        def _upload_blob(_tid: TaskID, fd: FileNode) -> None:
            if not fd.path.exists():
                raise NotFoundError(f"{fd.path} not found")

            if progress is not None:
                progress.update(_tid, visible=True)
            self.do_multipart_upload_file(
                url_path=url_path,
                file_path=fd.path,
                instance_uri=self.dest_uri,
                params={
                    self.field_flag: self.field_value,
                    "phase": _UploadPhase.BLOB,
                    "uploadId": upload_id,
                    "partName": fd.name,
                    "signature": fd.signature,
                    "desc": fd.file_desc.name,
                },
                use_raise=True,
                progress=progress,
                task_id=_tid,
            )

        _p_map = {}
        for _id, _f in enumerate(self.upload_files(workdir=workdir)):
            if existed_files and _f.signature in existed_files:
                continue

            if progress is None:
                _tid = TaskID(_id)
            else:
                _tid = progress.add_task(
                    f":arrow_up: {_f.path.name}",
                    total=float(_f.size),
                    visible=False,
                )
            _p_map[_tid] = _f
        with ThreadPoolExecutor(
            max_workers=int(os.environ.get("SW_BUNDLE_COPY_THREAD_NUM", "5"))
        ) as executor:
            futures = [
                executor.submit(_upload_blob, _tid, _file_desc)
                for _tid, _file_desc in _p_map.items()
            ]
            # TODO throw errors
            wait(futures)

    def _do_ubd_end(self, upload_id: str, url_path: str, ok: bool) -> None:
        phase = _UploadPhase.END if ok else _UploadPhase.CANCEL
        self.do_http_request(
            path=url_path,
            method=HTTPMethod.POST,
            instance_uri=self.dest_uri,
            data={
                self.field_flag: self.field_value,
                "project": self.dest_uri.project,
                "phase": phase,
                "uploadId": upload_id,
            },
            use_raise=True,
            disable_default_content_type=True,
        )

    def _do_upload_bundle_dir(
        self,
        progress: t.Optional[Progress] = None,
        workdir: t.Optional[Path] = None,
    ) -> None:
        workdir = workdir or self._get_versioned_resource_path(self.src_uri)
        url_path = self._get_remote_bundle_api_url()

        res_data = self._do_ubd_bundle_prepare(
            progress=progress,
            workdir=workdir,
            url_path=url_path,
        )
        upload_id: str = res_data.get("uploadId", "")
        if not upload_id:
            raise Exception("upload id is empty")
        exists_files: list = res_data.get("existed", [])
        try:
            self._do_ubd_blobs(
                progress=progress,
                workdir=workdir,
                upload_id=upload_id,
                url_path=url_path,
                existed_files=exists_files,
            )
        except Exception as e:
            console.print(
                f":confused_face: when upload blobs, we meet Exception{e}, will cancel upload"
            )
            self._do_ubd_end(upload_id=upload_id, url_path=url_path, ok=False)
            raise
        else:
            self._do_ubd_end(upload_id=upload_id, url_path=url_path, ok=True)

    @staticmethod
    def _update_manifest(workdir: Path, patch: t.Dict[str, t.Any]) -> None:
        file = workdir / DEFAULT_MANIFEST_NAME
        # downloaded runtime is a tarball
        if not file.exists():
            return
        manifest = load_yaml(file)
        manifest.update(patch)
        ensure_file(file, yaml.safe_dump(manifest, default_flow_style=False))
