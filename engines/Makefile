all: go java-util-regex pcre rust

.PHONY: go
go:
	make -C go

.PHONY: java-util-regex
java-util-regex:
	make -C java-util-regex

.PHONY: pcre
pcre:
	make -C pcre

.PHONY: rust
rust:
	make -C rust

.PHONY: clean
clean:
	make -C go clean
	make -C java-util-regex clean
	make -C pcre clean
	make -C rust clean
