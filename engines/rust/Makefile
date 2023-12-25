FILES := \
pkg/re_cmp_engine_rust.d.ts \
pkg/re_cmp_engine_rust.js \
pkg/re_cmp_engine_rust_bg.wasm \
pkg/re_cmp_engine_rust_bg.wasm.d.ts


$(FILES): src/lib.rs Cargo.toml Cargo.lock
	wasm-pack --quiet build --mode no-install --no-pack --release --target web

.PHONY: clean
clean:
	cargo --quiet clean
	rm -rf pkg
