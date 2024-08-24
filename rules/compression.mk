%.br: %
	brotli $< -fo $@

%.zst: %
	zstd $< -fo $@

%.gz: %
	gzip -c $< > $@
