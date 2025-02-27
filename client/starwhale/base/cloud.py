import typing as t
from copy import deepcopy
from http import HTTPStatus
from pathlib import Path
from datetime import datetime, timedelta

import yaml
import requests
from rich.progress import TaskID, Progress
from requests_toolbelt.multipart.encoder import (  # type: ignore
    MultipartEncoder,
    MultipartEncoderMonitor,
)

from starwhale.consts import (
    HTTPMethod,
    FMT_DATETIME,
    CREATED_AT_KEY,
    SW_API_VERSION,
    DEFAULT_PAGE_IDX,
    DEFAULT_PAGE_SIZE,
)
from starwhale.base.uri import URI
from starwhale.utils.fs import ensure_dir
from starwhale.utils.http import ignore_error, wrap_sw_error_resp
from starwhale.utils.error import NoSupportError
from starwhale.utils.retry import http_retry

_TMP_FILE_BUFSIZE = 8192
_DEFAULT_TIMEOUT_SECS = 90
_UPLOAD_CHUNK_SIZE = 20 * 1024 * 1024


class CloudRequestMixed:
    def fmt_timestamp(self, ts: t.Union[float, str]) -> str:
        return datetime.fromtimestamp(float(ts) / 1000.0).strftime(FMT_DATETIME).strip()

    def fmt_duration(self, ts: t.Union[float, str]) -> str:
        return str(timedelta(milliseconds=float(ts)))

    def do_download_file(
        self,
        url_path: str,
        dest_path: Path,
        instance_uri: URI,
        progress: t.Optional[Progress] = None,
        task_id: TaskID = TaskID(0),
        **kw: t.Any,
    ) -> None:
        r = self.do_http_request(
            path=url_path,
            instance_uri=instance_uri,
            method=HTTPMethod.GET,
            use_raise=True,
            **kw,
        )
        total = float(r.headers.get("content-length", 0))
        ensure_dir(dest_path.parent)
        with dest_path.open("wb") as f:
            for chunk in r.iter_content(chunk_size=_TMP_FILE_BUFSIZE):
                if progress:
                    progress.update(task_id, total=total, advance=len(chunk))
                f.write(chunk)
        if progress:
            # TODO: remove the hack code when api support content-length header
            progress.update(task_id, total=1, completed=1)

    def do_multipart_upload_file(
        self,
        url_path: str,
        instance_uri: URI,
        file_path: t.Union[str, Path],
        fields: t.Optional[t.Dict[str, t.Any]] = None,
        headers: t.Optional[t.Dict[str, t.Any]] = None,
        progress: t.Optional[Progress] = None,
        task_id: TaskID = TaskID(0),
        **kw: t.Any,
    ) -> requests.Response:
        fields = fields or {}
        headers = headers or {}
        # TODO: add progress bar and rich live

        def _progress_bar(monitor: MultipartEncoderMonitor) -> None:
            if progress:
                progress.update(task_id, completed=monitor.bytes_read)

        _headers = deepcopy(headers)
        fpath = Path(file_path).resolve().absolute()

        with fpath.open("rb") as f:
            fields["file"] = (fpath.name, f, "text/plain")

            _encoder = MultipartEncoder(fields=fields)
            # default chunk is 8192 Bytes
            _encoder._read = _encoder.read  # type: ignore
            _encoder.read = lambda size: _encoder._read(_UPLOAD_CHUNK_SIZE)  # type: ignore
            _headers["Content-Type"] = _encoder.content_type
            _monitor = MultipartEncoderMonitor(_encoder, callback=_progress_bar)
            return self.do_http_request(  # type: ignore
                url_path,
                instance_uri=instance_uri,
                method=HTTPMethod.POST,
                timeout=1200,
                data=_monitor,
                headers=_headers,
                **kw,
            )

    def do_http_request_simple_ret(
        self,
        path: str,
        instance_uri: URI,
        method: str = HTTPMethod.GET,
        **kw: t.Any,
    ) -> t.Tuple[bool, str]:
        r = self.do_http_request(path, instance_uri, method, **kw)
        status = r.status_code == HTTPStatus.OK

        try:
            message = r.json()["message"]
        except Exception as e:
            message = r.text or str(e)

        return status, message

    @staticmethod
    @http_retry
    def do_http_request(
        path: str,
        instance_uri: URI,
        method: str = HTTPMethod.GET,
        timeout: int = _DEFAULT_TIMEOUT_SECS,
        headers: t.Optional[t.Dict[str, t.Any]] = None,
        disable_default_content_type: bool = False,
        **kw: t.Any,
    ) -> requests.Response:
        _url = f"{instance_uri.instance}/api/{SW_API_VERSION}/{path.lstrip('/')}"
        _headers = {
            "Authorization": instance_uri.sw_token,
        }
        if not disable_default_content_type:
            _headers["Content-Type"] = "application/json"

        if headers is not None:
            _headers.update(headers)

        use_raise = kw.pop("use_raise", False)
        ignore_status_codes = kw.pop("ignore_status_codes", [])

        r = requests.request(
            method,
            _url,
            timeout=timeout,
            verify=False,
            headers=_headers,
            **kw,
        )
        wrap_sw_error_resp(
            r,
            path,
            use_raise=use_raise,
            silent=True,
            ignore_status_codes=ignore_status_codes,
        )
        return r

    def parse_pager(self, resp: t.Dict[str, t.Any]) -> t.Dict[str, t.Any]:
        _d = resp["data"]
        return dict(
            total=_d["total"],
            current=_d["size"],
            remain=_d["total"] - _d["size"],
        )

    def _fetch_bundle_info(self, uri: URI, typ: str) -> t.Dict[str, t.Any]:
        _manifest: t.Dict[str, t.Any] = {
            "uri": uri.full_uri,
            "project": uri.project,
            "name": uri.object.name,
        }

        if uri.object.version:
            # TODO: add manifest, lock(runtime), model/dataset/runtime yaml info by controller api
            _manifest["version"] = uri.object.version
            _info = self._fetch_bundle_version_info(uri, typ)
            _manifest[CREATED_AT_KEY] = self.fmt_timestamp(_info["createdTime"])
            _manifest["size"] = _info["files"][0]["size"]
        else:
            _manifest["history"] = self._fetch_bundle_history(
                name=uri.object.name,
                project_uri=uri,
                typ=typ,
            )[0]
        return _manifest

    def _fetch_bundle_version_info(self, uri: URI, typ: str) -> t.Dict[str, t.Any]:
        r = self.do_http_request(
            f"/project/{uri.project}/{typ}/{uri.object.name}",
            method=HTTPMethod.GET,
            instance_uri=uri,
            params={"versionName": uri.object.version},
        ).json()
        return r["data"]  # type: ignore

    def _fetch_bundle_history(
        self,
        name: str,
        project_uri: URI,
        typ: str,
        page: int = DEFAULT_PAGE_IDX,
        size: int = DEFAULT_PAGE_SIZE,
    ) -> t.Tuple[t.List[t.Dict[str, t.Any]], t.Dict[str, t.Any]]:
        r = self.do_http_request(
            f"/project/{project_uri.project}/{typ}/{name}/version",
            instance_uri=project_uri,
            method=HTTPMethod.GET,
            params={"pageNum": page, "pageSize": size},
        ).json()

        _history = []
        for _h in r["data"]["list"]:
            # TODO: add manifest
            _history.append(
                {
                    "id": _h["id"],
                    "name": name,
                    "version": _h["name"],
                    "size": self.get_bundle_size_from_resp(typ, _h),
                    CREATED_AT_KEY: self.fmt_timestamp(_h["createdTime"]),
                    "is_removed": _h.get("is_removed", False),
                }
            )

        return _history, self.parse_pager(r)

    def _fetch_bundle_all_list(
        self,
        project_uri: URI,
        uri_typ: str,
        page: int = DEFAULT_PAGE_IDX,
        size: int = DEFAULT_PAGE_SIZE,
        filter_dict: t.Optional[t.Dict[str, t.Any]] = None,
    ) -> t.Tuple[t.Dict[str, t.Any], t.Dict[str, t.Any]]:
        filter_dict = filter_dict or {}
        _params = {"pageNum": page, "pageSize": size}
        _params.update(filter_dict)
        r = self.do_http_request(
            f"/project/{project_uri.project}/{uri_typ}",
            params=_params,
            instance_uri=project_uri,
        ).json()
        objects = {}

        _page = page
        _size = size
        if filter_dict.get("latest") is not None:
            _page = 1
            _size = 1

        for o in r["data"]["list"]:
            _name = f"[{o['id']}] {o['name']}"
            objects[_name] = self._fetch_bundle_history(
                name=o["id"],
                project_uri=project_uri,
                typ=uri_typ,
                page=_page,
                size=_size,
            )[0]

        return objects, self.parse_pager(r)

    def get_bundle_size_from_resp(self, typ: str, item: t.Dict) -> int:
        default_size = 0
        size = item.get("size", default_size)
        if size:
            return int(size)
        meta_str = item.get("meta", False)
        if not meta_str:
            return default_size

        meta = yaml.safe_load(meta_str)
        if not isinstance(meta, dict):
            return default_size

        if typ == "dataset":
            return int(
                meta.get("dataset_summary", {}).get("blobs_byte_size", default_size)
            )
        if typ == "runtime":
            # no size info in meta for now
            return default_size

        return default_size


class CloudBundleModelMixin(CloudRequestMixed):
    def info(self) -> t.Dict[str, t.Any]:
        uri: URI = self.uri  # type: ignore
        return self._fetch_bundle_info(uri, uri.object.typ)

    @ignore_error(({}, {}))
    def history(
        self, page: int = DEFAULT_PAGE_IDX, size: int = DEFAULT_PAGE_SIZE
    ) -> t.Tuple[t.List[t.Dict[str, t.Any]], t.Dict[str, t.Any]]:
        uri: URI = self.uri  # type: ignore
        return self._fetch_bundle_history(
            name=uri.object.name,
            project_uri=uri,
            typ=uri.object.typ,
            page=page,
            size=size,
        )

    def remove(self, force: bool = False) -> t.Tuple[bool, str]:
        # TODO: remove specific version
        # TODO: add force flag
        uri: URI = self.uri  # type: ignore
        return self.do_http_request_simple_ret(
            f"/project/{uri.project}/{uri.object.typ}/{uri.object.name}",
            method=HTTPMethod.DELETE,
            instance_uri=uri,
        )

    def recover(self, force: bool = False) -> t.Tuple[bool, str]:
        # TODO: recover specific version
        # TODO: add force flag
        uri: URI = self.uri  # type: ignore
        return self.do_http_request_simple_ret(
            f"/project/{uri.project}/{uri.object.typ}/{uri.object.name}/recover",
            method=HTTPMethod.PUT,
            instance_uri=uri,
        )

    def list_tags(self) -> t.List[str]:
        raise NoSupportError("no support list tags for dataset in the cloud instance")

    def add_tags(self, tags: t.List[str], ignore_errors: bool = False) -> None:
        raise NoSupportError("no support add tags for dataset in the cloud instance")

    def remove_tags(self, tags: t.List[str], ignore_errors: bool = False) -> None:
        raise NoSupportError("no support remove tags for dataset in the cloud instance")
