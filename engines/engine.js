class Match {
  /**
   * The start byte-index for the match.
   *
   * @type {bigint}
   */
  start;
  /**
   * The exclusive, end byte-index for the match.
   *
   * @type {bigint}
   */
  end;
}

/**
 * @classdesc Regex interface.
 *
 * @name Regex
 * @class
 */

/**
 * Search for matches of this regex within the given text.
 *
 * @method
 * @name Regex#matches
 * @param {string} Text to search for matches.
 * @returns {Promise<Match[]>} Promise resolving to matches within text.
 */

/**
 * Drop this regex, freeing resources. This regex cannot be used after drop is
 * called.
 *
 * @method
 * @name Regex#drop
 */

/**
 * @classdesc Engine interface.
 *
 * @name Engine
 * @class
 */

/**
 * Compile the given string into a regex.
 *
 * @method
 * @name Engine#compile
 * @param {string} Regex string to compile.
 * @returns {Promise<Regex>} Promise resolving to compiled regex. May reject
 * with a SyntaxError if the regex string cannot be compiled.
 */

/**
 * Drop this engine, freeing resources. This engine cannot be used after drop is
 * called.
 *
 * @method
 * @name Engine#drop
 */
