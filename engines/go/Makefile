GOROOT := $(shell go env GOROOT)

all: main.wasm wasm_exec.js

main.wasm: main.go go.mod
	GOOS=js GOARCH=wasm go build -o $@

wasm_exec.js: $(GOROOT)/misc/wasm/wasm_exec.js
	echo "// @ts-nocheck" > $@
	cat $< >> $@

.PHONY: clean
clean:
	rm -f main.wasm wasm_exec.js
