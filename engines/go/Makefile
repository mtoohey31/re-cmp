GOROOT := $(shell go env GOROOT)

ALL_FILES := main.wasm.br main.wasm.zst main.wasm.gz main.wasm wasm_exec.js

all: $(ALL_FILES)

include ../../rules/compression.mk

main.wasm: main.go go.mod
	GOOS=js GOARCH=wasm go build -o $@

wasm_exec.js: $(GOROOT)/misc/wasm/wasm_exec.js
	echo "// @ts-nocheck" > $@
	cat $< >> $@

.PHONY: clean
clean:
	rm -f $(ALL_FILES)
