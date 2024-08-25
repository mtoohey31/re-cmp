// @ts-check

let {
  compile: compile_,
  matches: matches_,
  RegexResult: { isOk, get, getMessage },
} = await import("./build/generated/teavm/js/java-util-regex.js");

/**
 * @typedef {import("../index.mjs").Regex} IRegex
 * @implements IRegex
 */
class Regex {
  /**
   * @param {any} regex
   */
  constructor(regex) {
    this.regex = regex;
  }

  /**
   * @field {any} regex
   */
  regex;

  /**
   * Search for matches of this regex within the given text.
   *
   * @param {string} text to search for matches.
   * @returns {import("../index.mjs").Match[]} Matches of this regex within text.
   */
  matches(text) {
    return matches_(this.regex, text);
  }

  /**
   * Drop this regex, freeing resources. This regex cannot be used after drop is
   * called.
   */
  drop() {}
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
    // @ts-ignore
    const res = compile_(regex);
    if (isOk(res)) {
      return new Regex(get(res));
    } else {
      throw SyntaxError(getMessage(res));
    }
  }

  /**
   * Drop this engine, freeing resources. This engine cannot be used after drop
   * is called.
   */
  drop() {}
}

export const engine = new Engine();
