// @ts-check

import { Match } from "../engine.mjs";

/**
 * @typedef {import("../engine.mjs").Regex} IRegex
 * @typedef {import("../engine.mjs").Engine} IEngine
 */

/**
 * @implements IRegex
 */
class Regex {
  /**
   * @param {string} regex
   */
  constructor(regex) {
    this.inner = RegExp(regex, "g");
  }

  /**
   * @type {RegExp}
   */
  inner;

  /**
   * Search for matches of this regex within the given text.
   *
   * @param {string} text to search for matches.
   * @returns {Promise<Match[]>} Promise resolving to matches within text.
   */
  async matches(text) {
    const matchArrayIter = text.matchAll(this.inner);

    const res = [];
    for (const matchArray of matchArrayIter) {
      if (matchArray.index === undefined) {
        continue;
      }

      res.push(
        new Match(matchArray.index, matchArray.index + matchArray[0].length),
      );
    }
    return res;
  }

  drop() {}
}

/**
 * @implements IEngine
 */
class Engine {
  /**
   * Compile the given string into a regex.
   *
   * @param {string} regex string to compile.
   * @returns {Promise<Regex>} Promise resolving to compiled regex. May reject
   * with a SyntaxError if the regex string cannot be compiled.
   */
  async compile(regex) {
    return new Regex(regex);
  }

  async drop() {}
}

export const engine = new Engine();
