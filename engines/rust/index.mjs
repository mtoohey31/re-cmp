// @ts-check

/**
@typedef {import("../index.mjs").Match} Match
@typedef {import("./pkg/re_cmp_engine_rust.d.ts").Engine} Engine_
@typedef {import("./pkg/re_cmp_engine_rust.d.ts").Regex} Regex_
*/

/**
 * @typedef {import("../index.mjs").Regex} IRegex
 * @implements IRegex
 */
class Regex {
  /**
   * @param {Regex_} regex
   */
  constructor(regex) {
    this.inner = regex;
  }

  /**
   * @type {import("./pkg/re_cmp_engine_rust.d.ts").Regex}
   */
  inner;

  /**
   * Search for matches of this regex within the given text.
   *
   * @param {string} text to search for matches.
   * @returns {Promise<Match[]>} Promise resolving to matches within text.
   */
  async matches(text) {
    return await this.inner.matches(text);
  }

  drop() {
    this.inner.free();
  }
}

/**
 * @typedef {import("../index.mjs").Engine} IEngine
 * @implements IEngine
 */
class Engine {
  /**
   * @param {Engine_} engine
   */
  constructor(engine) {
    this.inner = engine;
  }

  /**
   * @type {Engine_}
   */
  inner;

  /**
   * Compile the given string into a regex.
   *
   * @param {string} regex string to compile.
   * @returns {Promise<Regex>} Promise resolving to compiled regex. May reject
   * with a SyntaxError if the regex string cannot be compiled.
   */
  async compile(regex) {
    const regex_ = await this.inner.compile(regex);
    return new Regex(regex_);
  }

  async drop() {
    this.inner.free();
  }
}

const { default: init, Engine: Engine_ } = await import(
  "./pkg/re_cmp_engine_rust.js"
);
await init();
const engine_ = Engine_.new();
export const engine = new Engine(engine_);
