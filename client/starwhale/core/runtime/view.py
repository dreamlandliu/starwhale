from __future__ import annotations

import os
import typing as t
from pathlib import Path

import click
from rich.pretty import Pretty
from rich.syntax import Syntax

from starwhale.utils import console, load_yaml, pretty_bytes, in_production
from starwhale.consts import (
    PythonRunEnv,
    DefaultYAMLName,
    DEFAULT_PAGE_IDX,
    DEFAULT_PAGE_SIZE,
    STANDALONE_INSTANCE,
)
from starwhale.base.uri import URI
from starwhale.base.type import URIType, InstanceType
from starwhale.base.view import BaseTermView
from starwhale.utils.venv import get_python_version
from starwhale.utils.error import NoSupportError
from starwhale.utils.config import SWCliConfigMixed

from .model import (
    Runtime,
    _SUPPORT_CUDA,
    RuntimeInfoFilter,
    StandaloneRuntime,
    _SUPPORT_PYTHON_VERSIONS,
)


class RuntimeTermView(BaseTermView):
    def __init__(self, runtime_uri: str | URI) -> None:
        super().__init__()

        if isinstance(runtime_uri, URI):
            self.uri = runtime_uri
        else:
            self.uri = URI(runtime_uri, expected_type=URIType.RUNTIME)

        self.runtime = Runtime.get_runtime(self.uri)

    @BaseTermView._simple_action_print
    def remove(self, force: bool = False) -> t.Tuple[bool, str]:
        return self.runtime.remove(force)

    @BaseTermView._simple_action_print
    def recover(self, force: bool = False) -> t.Tuple[bool, str]:
        return self.runtime.recover(force)

    @BaseTermView._pager
    @BaseTermView._header
    def history(self, fullname: bool = False) -> t.List[t.Dict[str, t.Any]]:
        fullname = fullname or self.uri.instance_type == InstanceType.CLOUD
        return self._print_history(
            title="Runtime History", history=self.runtime.history(), fullname=fullname
        )

    def info(
        self,
        output_filter: RuntimeInfoFilter = RuntimeInfoFilter.basic,
    ) -> None:
        info = self.runtime.info()
        if not info:
            console.print(
                f":anguished_face: No runtime info found: {self.uri}", style="red"
            )
            return

        basic_content = Pretty(info["basic"], expand_all=True)
        runtime_content = Syntax(
            info.get("runtime_yaml", ""), "yaml", theme="ansi_dark"
        )
        manifest_content = Pretty(info.get("manifest", {}), expand_all=True)
        _locks = []
        for fname, content in info.get("lock", {}).items():
            _locks.append(f"#lock file: {fname}")
            _locks.append(content)
        lock_content = "\n".join(_locks)

        if output_filter == RuntimeInfoFilter.basic:
            console.print(basic_content)
        elif output_filter == RuntimeInfoFilter.runtime_yaml:
            console.print(runtime_content)
        elif output_filter == RuntimeInfoFilter.lock:
            console.print(lock_content)
        elif output_filter == RuntimeInfoFilter.manifest:
            console.print(manifest_content)
        else:
            console.rule("[green bold] Runtime Basic Info")
            console.print(basic_content)
            console.rule("[green bold] runtime.yaml")
            console.print(runtime_content)
            console.rule("[green bold] _manifest.yaml")
            console.print(manifest_content)
            console.rule("[green bold] Runtime Lock Files")
            console.print(lock_content)

    @classmethod
    @BaseTermView._only_standalone
    def activate(cls, uri: URI, force_restore: bool = False) -> None:
        Runtime.activate(uri, force_restore)

    @BaseTermView._only_standalone
    def dockerize(
        self,
        tags: t.List[str],
        push: bool,
        platforms: t.List[str],
        dry_run: bool,
        use_starwhale_builder: bool,
        reset_qemu_static: bool,
    ) -> None:
        self.runtime.dockerize(
            tags=tags,
            push=push,
            platforms=platforms,
            dry_run=dry_run,
            use_starwhale_builder=use_starwhale_builder,
            reset_qemu_static=reset_qemu_static,
        )

    @classmethod
    @BaseTermView._only_standalone
    def lock(
        cls,
        target_dir: str,
        yaml_name: str = DefaultYAMLName.RUNTIME,
        env_name: str = "",
        env_prefix_path: str = "",
        no_cache: bool = False,
        stdout: bool = False,
        include_editable: bool = False,
        include_local_wheel: bool = False,
        emit_pip_options: bool = False,
        env_use_shell: bool = False,
    ) -> None:
        Runtime.lock(
            target_dir=target_dir,
            yaml_name=yaml_name,
            env_name=env_name,
            env_prefix_path=env_prefix_path,
            stdout=stdout,
            no_cache=no_cache,
            include_editable=include_editable,
            include_local_wheel=include_local_wheel,
            emit_pip_options=emit_pip_options,
            env_use_shell=env_use_shell,
        )

    @classmethod
    @BaseTermView._only_standalone
    def build(
        cls,
        workdir: t.Union[str, Path],
        project: str = "",
        yaml_name: str = DefaultYAMLName.RUNTIME,
        gen_all_bundles: bool = False,
        include_editable: bool = False,
        include_local_wheel: bool = False,
        disable_env_lock: bool = False,
        no_cache: bool = False,
        env_prefix_path: str = "",
        env_name: str = "",
        env_use_shell: bool = False,
    ) -> URI:
        workdir = Path(workdir)
        yaml_fpath = workdir / yaml_name
        if not yaml_fpath.exists():
            click.confirm(
                f"Do you want to render {yaml_name}@{workdir.absolute()}?",
                abort=True,
            )
            mode = click.prompt(
                "Choose python env:",
                type=click.Choice([PythonRunEnv.VENV, PythonRunEnv.CONDA]),
                default=PythonRunEnv.VENV,
            )
            _default_python_version = get_python_version()
            python_version = click.prompt(
                "Choose python version:",
                type=click.Choice(_SUPPORT_PYTHON_VERSIONS),
                default=_default_python_version,
            )

            pkgs_input = click.prompt(
                "Input python dependencies, split by the comma",
                type=str,
                default="",
            )

            if click.confirm("Do you want to enable cuda?"):
                cuda_version = click.prompt(
                    "Choose cuda version:",
                    type=click.Choice(_SUPPORT_CUDA),
                    default="11.4",
                )
            else:
                cuda_version = None

            StandaloneRuntime.render_runtime_yaml(
                workdir=workdir,
                name=workdir.absolute().name,
                mode=mode,
                python_version=python_version,
                pkgs=pkgs_input.split(","),
                force=True,
                auto_inject_sw=True,
                cuda_version=cuda_version,
            )

            click.confirm(
                f"{yaml_name} has been generated, do you want to continue build?",
                abort=True,
            )

        _config = load_yaml(yaml_fpath)
        _runtime_uri = cls.prepare_build_bundle(
            project=project, bundle_name=_config.get("name"), typ=URIType.RUNTIME
        )
        if include_editable:
            console.print(
                ":bell: [red bold]runtime will include pypi editable package[/] :bell:"
            )
        else:
            console.print(
                ":bird: [red bold]runtime will ignore pypi editable package[/]"
            )

        _rt = Runtime.get_runtime(_runtime_uri)
        _rt.build(
            workdir=Path(workdir),
            yaml_name=yaml_name,
            gen_all_bundles=gen_all_bundles,
            include_editable=include_editable,
            include_local_wheel=include_local_wheel,
            disable_env_lock=disable_env_lock,
            no_cache=no_cache,
            env_prefix_path=env_prefix_path,
            env_name=env_name,
            env_use_shell=env_use_shell,
        )
        return _runtime_uri

    @BaseTermView._only_standalone
    def extract(self, force: bool = False, target: t.Union[str, Path] = "") -> None:
        console.print(":oncoming_police_car: try to extract ...")
        path = self.runtime.extract(force, target)
        console.print(f":clap: extracted @ {path.resolve()} :tada:")

    @classmethod
    def list(
        cls,
        project_uri: str = "",
        fullname: bool = False,
        show_removed: bool = False,
        page: int = DEFAULT_PAGE_IDX,
        size: int = DEFAULT_PAGE_SIZE,
        filters: t.Optional[t.List[str]] = None,
    ) -> t.Tuple[t.List[t.Dict[str, t.Any]], t.Dict[str, t.Any]]:
        filters = filters or []
        _uri = URI(project_uri, expected_type=URIType.PROJECT)
        cls.must_have_project(_uri)
        fullname = fullname or (_uri.instance_type == InstanceType.CLOUD)
        _runtimes, _pager = Runtime.list(_uri, page, size, filters)
        _data = BaseTermView.list_data(_runtimes, show_removed, fullname)
        return _data, _pager

    @classmethod
    @BaseTermView._only_standalone
    def quickstart_from_uri(
        cls,
        workdir: t.Union[Path, str],
        name: str,
        uri: URI,
        force: bool = False,
        disable_restore: bool = False,
    ) -> None:
        console.print(
            f":construction: quickstart Starwhale Runtime[{name}] environment from runtime URI({uri})..."
        )
        _sw_config = SWCliConfigMixed()
        if _sw_config.current_instance != STANDALONE_INSTANCE:
            raise NoSupportError(f"{_sw_config.current_instance} quickstart")
        StandaloneRuntime.quickstart_from_uri(
            workdir, name, uri, force, disable_restore
        )
        console.print(":clap: Starwhale Runtime environment is ready to use :tada:")

    @classmethod
    @BaseTermView._only_standalone
    def quickstart_from_ishell(
        cls,
        workdir: t.Union[Path, str],
        name: str,
        mode: str,
        disable_create_env: bool = False,
        force: bool = False,
        interactive: bool = False,
    ) -> None:
        console.print(
            f":construction: quickstart Starwhale Runtime[{name}] environment..."
        )
        StandaloneRuntime.quickstart_from_ishell(
            workdir, name, mode, disable_create_env, force, interactive
        )
        console.print(":clap: Starwhale Runtime environment is ready to use :tada:")

    @classmethod
    @BaseTermView._only_standalone
    def restore(cls, target: str) -> None:
        if in_production() or (os.path.exists(target) and os.path.isdir(target)):
            workdir = Path(target)
        else:
            _uri = URI(target, URIType.RUNTIME)
            _runtime = StandaloneRuntime(_uri)
            workdir = _runtime.store.snapshot_workdir
            if not workdir.exists():
                _runtime.extract(force=True, target=workdir)

        console.print(
            f":golfer: try to restore python runtime environment: {workdir} ..."
        )
        Runtime.restore(workdir)

    @classmethod
    def copy(
        cls,
        src_uri: str,
        dest_uri: str,
        force: bool = False,
        dest_local_project_uri: str = "",
    ) -> None:
        Runtime.copy(src_uri, dest_uri, force, dest_local_project_uri)
        console.print(":clap: copy done.")

    @BaseTermView._header
    def tag(
        self, tags: t.List[str], remove: bool = False, ignore_errors: bool = False
    ) -> None:
        # TODO: refactor model/runtime/dataset tag view-model
        if remove:
            console.print(f":golfer: remove tags [red]{tags}[/] @ {self.uri}...")
            self.runtime.remove_tags(tags, ignore_errors)
        else:
            console.print(f":surfer: add tags [red]{tags}[/] @ {self.uri}...")
            self.runtime.add_tags(tags, ignore_errors)


class RuntimeTermViewRich(RuntimeTermView):
    @classmethod
    @BaseTermView._pager
    def list(
        cls,
        project_uri: str = "",
        fullname: bool = False,
        show_removed: bool = False,
        page: int = DEFAULT_PAGE_IDX,
        size: int = DEFAULT_PAGE_SIZE,
        filters: t.Optional[t.List[str]] = None,
    ) -> t.Tuple[t.List[t.Dict[str, t.Any]], t.Dict[str, t.Any]]:
        filters = filters or []
        _data, _pager = super().list(
            project_uri, fullname, show_removed, page, size, filters
        )

        custom_column: t.Dict[str, t.Callable[[t.Any], str]] = {
            "tags": lambda x: ",".join(x),
            "size": lambda x: pretty_bytes(x),
            "runtime": cls.place_holder_for_empty(),
        }

        cls.print_header()
        cls.print_table("Runtime List", _data, custom_column=custom_column)
        return _data, _pager


class RuntimeTermViewJson(RuntimeTermView):
    @classmethod
    def list(  # type: ignore
        cls,
        project_uri: str = "",
        fullname: bool = False,
        show_removed: bool = False,
        page: int = DEFAULT_PAGE_IDX,
        size: int = DEFAULT_PAGE_SIZE,
        filters: t.Optional[t.List[str]] = None,
    ) -> None:
        filters = filters or []
        _data, _pager = super().list(
            project_uri, fullname, show_removed, page, size, filters
        )
        cls.pretty_json(_data)

    def info(
        self,
        output_filter: RuntimeInfoFilter = RuntimeInfoFilter.basic,
    ) -> None:
        info = self.runtime.info()

        if output_filter == RuntimeInfoFilter.basic:
            info = {"basic": info.get("basic", {})}
        elif output_filter == RuntimeInfoFilter.lock:
            info = {"lock": info.get("lock", {})}
        elif output_filter == RuntimeInfoFilter.manifest:
            info = {"manifest": info.get("manifest", {})}
        elif output_filter == RuntimeInfoFilter.runtime_yaml:
            info = {"runtime_yaml": info.get("runtime_yaml", "")}

        self.pretty_json(info)

    def history(self, fullname: bool = False) -> None:
        fullname = fullname or self.uri.instance_type == InstanceType.CLOUD
        _data = BaseTermView.get_history_data(
            history=self.runtime.history(), fullname=fullname
        )
        self.pretty_json(_data)


def get_term_view(ctx_obj: t.Dict) -> t.Type[RuntimeTermView]:
    return (
        RuntimeTermViewJson if ctx_obj.get("output") == "json" else RuntimeTermViewRich
    )
