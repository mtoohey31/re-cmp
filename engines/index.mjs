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
 */
export class Regex {
  /**
   * Search for matches of this regex within the given text.
   *
   * @param {string} text to search for matches.
   * @returns {Promise<Match[]>} Promise resolving to matches within text.
   */
  async matches(text) {
    throw new Error("abstract method");
  }

  /**
   * Drop this regex, freeing resources. This regex cannot be used after drop is
   * called.
   */
  drop() {
    throw new Error("abstract method");
  }
}

/**
 * @classdesc Engine interface.
 */
export class Engine {
  /**
   * Compile the given string into a regex.
   *
   * @param {string} regex string to compile.
   * @returns {Promise<Regex>} Promise resolving to compiled regex. May reject
   * with a SyntaxError if the regex string cannot be compiled.
   */
  async compile(regex) {
    throw new Error("abstract method");
  }

  /**
   * Drop this engine, freeing resources. This engine cannot be used after drop is
   * called.
   */
  drop() {
    throw new Error("abstract method");
  }
}
