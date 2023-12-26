// @ts-check

import { Match } from "../index.mjs";

/**
 * @typedef {import("../index.mjs").Regex} IRegex
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
   * @returns {Match[]} Matches of this regex within text.
   */
  matches(text) {
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
    return new Regex(regex);
  }

  drop() {}
}

export const engine = new Engine();
