BG_FILES := \
re_cmp_engine_rust.d.ts \
re_cmp_engine_rust.js \
re_cmp_engine_rust_bg.wasm \
re_cmp_engine_rust_bg.wasm.d.ts

WASM_FILE := target/wasm32-unknown-unknown/release/re_cmp_engine_rust.wasm

$(BG_FILES): $(WASM_FILE)
	wasm-bindgen $< --out-dir . --target web

$(WASM_FILE): src/lib.rs Cargo.toml Cargo.lock
	cargo build --quiet --release --target wasm32-unknown-unknown

.PHONY: clean
clean:
	cargo --quiet clean
	rm -f $(BG_FILES)
