FILES := engine.mjs engine.wasm

$(FILES): engine.c
	emcc $< $$(pcre-config --cflags --libs) -s EXIT_RUNTIME -s EXPORTED_RUNTIME_METHODS=ccall -o engine.mjs
	sed -i "1i // @ts-nocheck" engine.mjs

compile_commands.json: Makefile
	make clean
	bear -- make

.PHONY: clean
clean:
	rm -f $(FILES)
