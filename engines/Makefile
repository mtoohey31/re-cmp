all: go pcre rust

.PHONY: go
go:
	make -C go

.PHONY: pcre
pcre:
	make -C pcre

.PHONY: rust
rust:
	make -C rust

.PHONY: clean
clean:
	make -C go clean
	make -C pcre clean
	make -C rust clean
