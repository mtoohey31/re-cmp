/** @typedef {import("vendor/ace-builds/ace.d.ts").Ace.Editor} Editor */

// @ts-ignore
const Range = ace.require("ace/range").Range;

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

const compileError = document.getElementById("compile-error");
if (compileError === null) {
  throw new Error("couldn't find compile-error element");
}

const { engine } = await import("./engines/javascript/index.mjs");

/** @type {number[]} */
let matchIds = [];
const updateMatches = async () => {
  if (regex === null) {
    throw new Error("updateMatches called while regex was null");
  }

  matchIds.forEach((matchId) => corpusEditor.session.removeMarker(matchId));
  matchIds = [];

  // TODO: Loading indicator.
  const matches = await regex.matches(corpusEditor.session.getValue());

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

/**
 * @type {import("./engines/index.mjs").Regex | null}
 */
let regex = await engine.compile("");
regexEditor.on("change", async () => {
  try {
    if (regex !== null) {
      regex.drop();
    }

    regex = await engine.compile(regexEditor.session.getValue());
    compileError.textContent = "";
    await updateMatches();
  } catch (err) {
    if (!(err instanceof SyntaxError)) {
      throw err;
    }

    regex = null;
    compileError.textContent = err.message;
  }
});

corpusEditor.on("change", async () => {
  if (regex === null) {
    return;
  }

  await updateMatches();
});
