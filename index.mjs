// Types.

/** @typedef {import("vendor/ace-builds/ace.d.ts").Ace.Editor} Editor */

// @ts-ignore
const Range = ace.require("ace/range").Range;

// Utils.

/**
 * @param {Editor} editor
 * @param {string} key
 */
const unbindKey = (editor, key) => {
  /** @type {import("vendor/ace-builds/ace.d.ts").Ace.CommandLike} */
  // @ts-ignore
  const command = null;
  editor.commands.bindKey(key, command);
};

// Editor Setup.

/** @type {Editor} */
// @ts-ignore
const regexEditor = ace.edit("regex");

// TODO: Implement regex mode for highlighting, see https://github.com/ajaxorg/ace/issues/1752
regexEditor.setOptions({
  highlightActiveLine: false,
  maxLines: 1,
  minLines: 1,
  showGutter: false,
  showLineNumbers: false,
  showPrintMargin: false,
});
regexEditor.on("paste", (event) => {
  event.text = event.text.replace(/[\r\n]+/g, " ");
});
unbindKey(regexEditor, "Enter|Shift-Enter");
unbindKey(regexEditor, "Tab");
unbindKey(regexEditor, "Shift-Tab");

/** @type {Editor} */
// @ts-ignore
const corpusEditor = ace.edit("corpus");
corpusEditor.setOptions({
  highlightActiveLine: false,
  showGutter: false,
  showLineNumbers: false,
  showPrintMargin: false,
});
unbindKey(corpusEditor, "Tab");
unbindKey(corpusEditor, "Shift-Tab");

regexEditor.focus();

// Engine and Listener Setup.

const compileError = document.getElementById("compile-error");
if (compileError === null) {
  throw new Error("couldn't find compile-error element");
}
const engineSelect = document.getElementById("engine");
if (engineSelect === null) {
  throw new Error("couldn't find engine element");
}
if (!(engineSelect instanceof HTMLSelectElement)) {
  throw new Error("engine element was of unexpected type");
}

const { engines, defaultEngineName } = await import("./engines/index.mjs");

// Insert defaultEngineName first so it shows as selected first.
const option = document.createElement("option");
option.textContent = defaultEngineName;
engineSelect.appendChild(option);

for (const engineName of engines.keys()) {
  if (engineName === defaultEngineName) {
    continue;
  }

  const option = document.createElement("option");
  option.textContent = engineName;
  engineSelect.appendChild(option);
}

const defaultEnginePath = engines.get(defaultEngineName);
if (defaultEnginePath === undefined) {
  throw new Error("couldn't find default engine path");
}

/** @type {{engine: import("./engines/index.mjs").Engine}} */
let { engine } = await import(defaultEnginePath);

/** @type {number[]} */
let matchIds = [];
const clearMatches = () => {
  matchIds.forEach((matchId) => corpusEditor.session.removeMarker(matchId));
  matchIds = [];
};

const updateMatches = async () => {
  if (regex === null) {
    throw new Error("updateMatches called while regex was null");
  }

  clearMatches();

  // TODO: Loading indicator.
  const matches = regex.matches(corpusEditor.session.getValue());

  for (const match of matches) {
    const startPos = corpusEditor.session.doc.indexToPosition(match.start, 0);
    const endPos = corpusEditor.session.doc.indexToPosition(match.end, 0);
    const range = new Range(
      startPos.row,
      startPos.column,
      endPos.row,
      endPos.column,
    );
    matchIds.push(corpusEditor.session.addMarker(range, "match", "text"));
  }
};

const recompile = async () => {
  try {
    if (regex !== null) {
      regex.drop();
    }

    regex = engine.compile(regexEditor.session.getValue());
    compileError.textContent = "";
    await updateMatches();
  } catch (err) {
    if (!(err instanceof SyntaxError)) {
      throw err;
    }

    regex = null;
    clearMatches();
    compileError.textContent = err.message;
  }
};

engineSelect.addEventListener("change", async function () {
  const engineName = this.value;
  const enginePath = engines.get(engineName);
  if (enginePath === undefined) {
    throw new Error(`invalid engine: ${engineName}`);
  }

  // TODO: Loading indicator.
  const { engine: newEngine } = await import(
    `${enginePath}?version=${Date.now()}`
  );
  if (regex !== null) {
    regex.drop();
    regex = null;
  }
  engine.drop();
  engine = newEngine;

  await recompile();
});

/**
 * @type {import("./engines/index.mjs").Regex | null}
 */
let regex = null;
await recompile();
regexEditor.on("change", recompile);

corpusEditor.on("change", async () => {
  if (regex === null) {
    return;
  }

  await updateMatches();
});
