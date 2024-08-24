// @ts-check

import { Match } from "../index.mjs";

const { default: getModule } = await import("./engine.mjs");
const { ccall } = await getModule();

/**
 * @typedef {import("../index.mjs").Regex} IRegex
 * @implements IRegex
 */
class Regex {
  /**
   * @param {any} pcre
   */
  constructor(pcre) {
    this.pcre = pcre;
  }

  /**
   * @field {any} pcre
   */
  pcre;

  /**
   * Search for matches of this regex within the given text.
   *
   * @param {string} text to search for matches.
   * @returns {import("../index.mjs").Match[]} Matches of this regex within text.
   */
  matches(text) {
    let prevEnd = 0;
    const res = [];
    for (;;) {
      const match = ccall(
        "pcre_next_match",
        "matches",
        ["pcre", "string", "number"],
        [this.pcre, text, prevEnd],
      );

      if (!ccall("match_some", "boolean", ["match"], [match])) {
        break;
      }

      const start = ccall("match_get_start", "number", ["match"], [match]);
      const end = ccall("match_get_end", "number", ["match"], [match]);
      ccall("match_drop", null, ["match"], [match]);

      res.push(new Match(start, end));
      prevEnd = end + (start === end);
    }
    return res;
  }

  drop() {
    ccall("pcre_drop", null, ["pcre"], [this.pcre]);
  }
}

/**
 * @typedef {import("../index.mjs").Engine} IEngine
 * @implements IEngine
 */
class Engine {
  /**
   * Compile the given string into a regex.
   *
   * @param {string} regex string to compile.
   * @returns {Regex} The compiled regex.
   * @throws {SyntaxError} When regex is malformed.
   */
  compile(regex) {
    const compileRes = ccall("compile", "compile_res", ["string"], [regex]);
    if (!ccall("compile_res_ok", "boolean", ["compile_res"], [compileRes])) {
      const errorString = ccall(
        "compile_res_unwrap_err",
        "string",
        ["compile_res"],
        [compileRes],
      );
      throw new SyntaxError(errorString);
    }

    return new Regex(
      ccall("compile_res_unwrap", "pcre", ["compile_res"], [compileRes]),
    );
  }

  drop() {
    ccall("drop");
  }
}

export const engine = new Engine();
