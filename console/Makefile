.PHONY: *

install-dev-tools:
	npm install -g yarn pnpm@latest

install-dependencies:
	yarn

build-ui:
	yarn build

ci-lint:
	yarn lint
	yarn typecheck

rebuild-gradio:
	[ -d "gradio" ] && git config --global --add safe.directory $(realpath gradio) || echo "gradio not exists"
	(([ -d gradio ] && git -C gradio clean -f -x && git -C gradio checkout . && git -C gradio reset --hard && git -C gradio pull) || (rm -rf gradio &&git clone --depth 1 --branch=feat/sw-gradio-widget https://github.com/star-whale/gradio gradio))	&& \
	export NODE_OPTIONS="--max_old_space_size=4096" && \
	export NODE_OPTIONS="--max-old-space-size=4096" && \
	cd gradio/ui && \
		pnpm i --fix-lockfile && \
		pnpm build && \
		cd ../.. && \
		rm -rf src/assets/GradioWidget && mkdir -p src/assets/GradioWidget && \
		mv gradio/ui/packages/starwhale/build src/assets/GradioWidget/es
	git -C gradio clean -f -x

build-all: install-dependencies rebuild-gradio build-ui
