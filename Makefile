JS_FILES := \
engines/go/index.mjs \
engines/go/wasm_exec.js \
engines/index.mjs \
engines/javascript/index.mjs \
engines/pcre/engine.mjs \
engines/pcre/index.mjs \
engines/rust/index.mjs \
engines/rust/re_cmp_engine_rust.js \
index.mjs

WASM_FILES := \
engines/go/main.wasm \
engines/go/main.wasm.br \
engines/go/main.wasm.zst \
engines/go/main.wasm.gz \
engines/rust/re_cmp_engine_rust_bg.wasm \
engines/rust/re_cmp_engine_rust_bg.wasm.br \
engines/rust/re_cmp_engine_rust_bg.wasm.zst \
engines/rust/re_cmp_engine_rust_bg.wasm.gz \
engines/pcre/engine.wasm

.PHONY: build
build: engines
	rm -rf build
	mkdir $@
	cp index.html $@
	for js_file in $(JS_FILES); do mkdir -p $$(dirname $@/$$js_file); uglifyjs --module $$js_file -o $@/$$js_file; done
	for wasm_file in $(WASM_FILES); do mkdir -p $$(dirname $@/$$wasm_file); cp $$wasm_file $@/$$wasm_file; done
	mkdir -p $@/vendor/ace-builds
	cp -r vendor/ace-builds/src-min $@/vendor/ace-builds/src-min

.PHONY: engines
engines:
	make -C engines

.PHONY: clean
clean:
	rm -rf build
	make -C engines clean
