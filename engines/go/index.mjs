// TODO: Enable and fix checking.
// @ts-nocheck
await import("./wasm_exec.js");

const go = new Go();
const result = await WebAssembly.instantiateStreaming(
  fetch("engines/go/main.wasm"),
  go.importObject,
);
go.run(result.instance);
export const engine = globalThis.reCmpEngineGo;
