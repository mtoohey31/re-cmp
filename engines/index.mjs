export class Match {
  /**
   * @param {number} start
   * @param {number} end
   */
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  /**
   * The start byte-index for the match.
   *
   * @type {number}
   */
  start;
  /**
   * The exclusive, end byte-index for the match.
   *
   * @type {number}
   */
  end;
}

/**
 * @classdesc Regex interface.
 * @interface
 */
export class Regex {
  /**
   * Search for matches of this regex within the given text.
   *
   * @abstract
   * @param {string} text to search for matches.
   * @returns {Match[]} Matches of this regex within text.
   */
  matches(text) {
    throw new Error("abstract method");
  }

  /**
   * Drop this regex, freeing resources. This regex cannot be used after drop is
   * called.
   *
   * @abstract
   */
  drop() {
    throw new Error("abstract method");
  }
}

/**
 * @classdesc Engine interface.
 * @interface
 */
export class Engine {
  /**
   * Compile the given string into a regex.
   *
   * @abstract
   * @param {string} regex string to compile.
   * @returns {Regex} The compiled regex.
   * @throws {SyntaxError} When regex is malformed.
   */
  compile(regex) {
    throw new Error("abstract method");
  }

  /**
   * Drop this engine, freeing resources. This engine cannot be used after drop
   * is called.
   *
   * @abstract
   */
  drop() {
    throw new Error("abstract method");
  }
}

// Using the JavaScript engine as the default ensures fast initial loads.
export const defaultEngineName = "JavaScript browser native";

export const engines = new Map([
  ["Go regexp package", "./engines/go/index.mjs"],
  ["Rust regex crate", "./engines/rust/index.mjs"],
  ["PCRE", "./engines/pcre/index.mjs"],
  [defaultEngineName, "./engines/javascript/index.mjs"],
  ["Java java/util/regex", "./engines/java-util-regex/index.mjs"],
]);
