#include <emscripten/emscripten.h>
#include <pcre.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

struct compile_res {
  bool ok;
  union {
    pcre *ok;
    const char *err;
  } data;
};

EMSCRIPTEN_KEEPALIVE struct compile_res *compile(char *regex) {
  struct compile_res *res = malloc(sizeof(struct compile_res));
  int _errcode, _erroffset;
  pcre *regex_ =
      pcre_compile2(regex, 0, &_errcode, &res->data.err, &_erroffset, NULL);
  if (regex_ == NULL) {
    res->ok = false;
    return res;
  }

  res->ok = true;
  res->data.ok = regex_;
  return res;
}

EMSCRIPTEN_KEEPALIVE bool compile_res_ok(struct compile_res *res) {
  return res->ok;
}

EMSCRIPTEN_KEEPALIVE pcre *compile_res_unwrap(struct compile_res *res) {
  pcre *ret = res->data.ok;
  free(res);
  return ret;
}

EMSCRIPTEN_KEEPALIVE const char *
compile_res_unwrap_err(struct compile_res *res) {
  const char *ret = res->data.err;
  free(res);
  return ret;
}

EMSCRIPTEN_KEEPALIVE int *pcre_next_match(pcre *regex, const char *text,
                                          int start_offset) {
  int ovector[30];
  int rc =
      pcre_exec(regex, NULL, text, strlen(text), start_offset, 0, ovector, 30);
  if (rc <= 0)
    return NULL;

  int *match = malloc(sizeof(int) * 2);
  match[0] = ovector[0];
  match[1] = ovector[1];
  return match;
}

EMSCRIPTEN_KEEPALIVE bool match_some(int *match) { return match != NULL; }

EMSCRIPTEN_KEEPALIVE int match_get_start(int *match) { return match[0]; }

EMSCRIPTEN_KEEPALIVE int match_get_end(int *match) { return match[1]; }

EMSCRIPTEN_KEEPALIVE void match_drop(int *match) { free(match); }

EMSCRIPTEN_KEEPALIVE void pcre_drop(pcre *regex) { free(regex); }

EMSCRIPTEN_KEEPALIVE void drop() { emscripten_force_exit(0); }
