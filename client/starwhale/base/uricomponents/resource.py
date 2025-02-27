import re
from enum import Enum
from glob import glob
from typing import Any, Dict, Optional
from pathlib import Path
from dataclasses import dataclass

import requests

from starwhale.consts import SW_API_VERSION
from starwhale.base.uri import URI
from starwhale.utils.config import load_swcli_config
from starwhale.base.uricomponents.project import Project
from starwhale.base.uricomponents.instance import Instance
from starwhale.base.uricomponents.exceptions import (
    NoMatchException,
    UriTooShortException,
)

url_regex = re.compile(
    r"(?P<scheme>https*)://"
    r"(?P<host>.*)/projects/"
    r"(?P<project>.+)/"
    r"(?P<rc_type>models|datasets|runtimes|evaluations)"
    r"(/(?P<rc_id>.+)/versions)?"  # optional
    r"(/(?P<rc_version>.+)/.*)?",  # optional
    re.UNICODE,
)


class ResourceType(Enum):
    runtime = "runtime"
    model = "model"
    dataset = "dataset"
    evaluation = "evaluation"


@dataclass
class Resource:
    """
    Resource holds the DataSet, Model, Runtime, Eval etc.
    """

    typ: ResourceType
    project: Project
    name: Optional[str] = None
    version: Optional[str] = None

    def __init__(
        self,
        uri: str,
        typ: Optional[ResourceType] = None,
        project: Optional[Project] = None,
    ) -> None:
        """
        :param uri: resource name or uri or version
            accept patterns:
                * resource name without type, e.g. mnist
                * version e.g. gntdqm3fgeydqnrtmftdgyjzpj4hamy
                * full uri without version e.g. local/project/self/dataset/mnist
                * full uri e.g. local/project/self/dataset/mnist/version/latest
                * resource name and version e.g. mnist/version/latest
            typically unacceptable cases:
                * resource type and name under project e.g. self/dataset/mnist
                * resource type, name and version under project e.g. self/dataset/mnist/version/latest
        :param typ: resource type: (dataset, model, runtime etc)
        :param project: project which the resource belongs to (optional)
        :return: Resource instance
        """
        self._remote_info: Dict[str, Any] = {}

        # check if it is url from console
        m = url_regex.match(uri)
        if m is not None:
            info: Dict[str, str] = m.groupdict()
            ins = Instance(f'{info["scheme"]}://{info["host"]}')
            self.project = Project(name=info["project"], instance=ins)
            self.typ = ResourceType(info["rc_type"][:-1])  # remove the last 's'
            self.name = info.get("rc_id")
            self.version = info.get("rc_version")
            self.refine_remote_rc_info()
            return

        if project:
            self.project = project
        else:
            try:
                self.project = Project.parse_from_full_uri(
                    uri, ignore_rc_type=typ is not None
                )
                uri = self.project.path
            except UriTooShortException:
                self.project = Project()

        if "://" in uri:
            uri = uri.split("://", 1)[-1]

        if "//" in uri:
            raise Exception(f"wrong uri({uri}) format with '//'")

        parts = len(uri.split("/"))
        # 3 == len('mnist/version/latest'.split(/))
        # means that there is no type info in the uri
        if typ and parts <= 3:
            self._parse_with_type(typ, uri)
        else:
            # uri is long enough to parse type
            self._parse_without_type(uri)
        if (typ is not None) and self.typ != typ:
            raise Exception(f"type mismatch: {self.typ} vs {typ}")

        if not self.project.instance.is_local:
            self.refine_remote_rc_info()

    def _parse_with_type(self, typ: ResourceType, uri: str) -> None:
        """
        :param typ:
        :param uri:
            i.e.
            * mnist
            * mnist/latest
            * version/latest
            * mnist/version/latest
        """
        self.typ = typ
        parts = uri.split("/")
        if len(parts) > 3:
            raise Exception(f"invalid uri {uri} when parse with type {typ}")

        if len(parts) == 1:
            try:
                # try version first
                self._parse_by_version(parts[0])
            except NoMatchException:
                self.name = parts[0]
        elif len(parts) == 2:
            if parts[0] != "version":
                # name/version
                self.name = parts[0]
            self.version = parts[-1]
        else:
            if parts[1] != "version":
                raise Exception(f"invalid uri without version field: {uri}")
            self.name = parts[0]
            self.version = parts[-1]

    def _parse_without_type(self, uri: str) -> None:
        p = uri.split("/", 1)
        if len(p) == 1:
            # version only (we do not support name without type parsing)
            # there is no scenario for 'name without type' for now
            return self._parse_by_version(uri)
        typ = ResourceType[p[0]]
        return self._parse_with_type(typ, p[1])

    def _parse_by_version(self, ver: str) -> None:
        if self.instance.is_local:
            root = Path(load_swcli_config()["storage"]["root"]) / self.project.name
            # storage-root/project/type/name/prefix/full-version
            p = f"{root.absolute()}/*/*/*/{ver}*"
            m = glob(p)
            if len(m) == 1:
                _, typ, self.name, _, self.version = m[0].rsplit("/", 4)
                self.typ = ResourceType[typ]
            else:
                raise NoMatchException(ver, list(m))
        else:
            # TODO use api to check if it is a name or version
            # assume is is name for now
            self.name = ver

    def refine_remote_rc_info(self) -> None:
        if self.project.instance.is_local:
            raise Exception("only used for remote resources")
        if not self.name or not self.version:
            return
        if not self.name.isnumeric() and not self.version.isnumeric():
            # both are not numeric, assume it is already refined
            return

        base_path = f"{self.instance.url}/api/{SW_API_VERSION}/project/{self.project.name}/{self.typ.value}/{self.name}"
        headers = {"Authorization": self.instance.token}
        resp = requests.get(
            base_path, timeout=60, params={"versionUrl": self.version}, headers=headers
        )
        resp.raise_for_status()
        self._remote_info = resp.json().get("data", {})
        self.name = self._remote_info.get("name", self.name)
        self.version = self._remote_info.get("versionName", self.version)

    def info(self) -> Dict[str, Any]:
        # TODO: support local resource
        return self._remote_info or {}

    @property
    def instance(self) -> Instance:
        return self.project.instance

    def to_uri(self) -> URI:
        return URI.capsulate_uri(
            instance=str(self.instance),
            project=self.project.name,
            obj_type=self.typ.name,
            obj_name=self.name or "",
            obj_ver=self.version or "latest",
        )

    def __str__(self) -> str:
        return f"project: {self.project}, name: {self.name}, version: {self.version}"

    __repr__ = __str__
