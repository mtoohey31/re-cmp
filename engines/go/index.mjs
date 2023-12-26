// @ts-check

/**
 * @typedef {import("../index.mjs").Regex} Regex
 */

// @ts-ignore
await import("./wasm_exec.js");

// @ts-ignore
const go = new Go();
const result = await WebAssembly.instantiateStreaming(
  fetch("engines/go/main.wasm"),
  go.importObject,
);
go.run(result.instance);

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
    /** @type {Regex|Error} */
    // @ts-ignore
    const res = globalThis.reCmpEngineGo.compile(regex);
    if (res instanceof Error) {
      throw res;
    }

    return res;
  }

  /**
   * Drop this engine, freeing resources. This engine cannot be used after drop is
   * called.
   */
  drop() {
    // @ts-ignore
    globalThis.reCmpEngineGo.drop();
  }
}

export const engine = new Engine();
