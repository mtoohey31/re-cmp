// @ts-check

const regexInput = document.querySelector("input.regex");
if (regexInput === null) {
  throw new Error("couldn't find regex element");
}
if (!(regexInput instanceof HTMLInputElement)) {
  throw new Error("regex element was of unexpected type");
}
const compileError = document.querySelector(".compile-error");
if (compileError === null) {
  throw new Error("couldn't find compile-error element");
}
const corpusInput = document.querySelector(".corpus");
if (corpusInput === null) {
  throw new Error("couldn't find corpus element");
}

const { engine } = await import("./engines/javascript/index.mjs");

/**
 * @param {string} text
 */
const updateMatches = async (text) => {
  if (regex === null) {
    throw new Error("updateMatches called while regex was null");
  }

  // TODO: Loading indicator.
  const matches = await regex.matches(text);
  matches.sort((m1, m2) => Number(m1.start > m2.start));

  let cursor = undefined;
  const selection = window.getSelection();
  if (corpusInput.contains(document.activeElement) && selection !== null) {
    // TODO: Handle pasting.
    const { focusNode, focusOffset } = selection;
    let focusStart = 0;
    if (focusNode !== null) {
      const focusParent = focusNode.parentElement ?? focusNode;
      if (
        focusParent instanceof HTMLElement &&
        focusParent.dataset.hasOwnProperty("start")
      ) {
        focusStart = parseInt(focusParent.dataset.start ?? "0");
      }
    }
    cursor = focusStart + focusOffset;
  }

  corpusInput.textContent = "";

  /**
   * @param {number} start
   * @param {number} end
   * @param {boolean} isMatch
   */
  const pushChild = (start, end, isMatch) => {
    const span = document.createElement("span");
    span.textContent = text.slice(start, end);
    span.dataset.start = start.toString();

    if (isMatch) {
      span.style.setProperty("background-color", "aqua");
    }

    corpusInput.appendChild(span);

    const selection = window.getSelection();
    if (selection === null) {
      return;
    }

    if (cursor !== undefined && start <= cursor && cursor <= end) {
      const focusNode = span.firstChild ?? span;
      selection.collapse(focusNode, cursor - start);
    }
  };

  // TODO: Spaces break highlight offsets.
  let prevStart = 0;
  for (const { start, end } of matches) {
    pushChild(prevStart, start, false);
    pushChild(start, end, true);
    prevStart = end;
  }
  pushChild(prevStart, text.length, false);
};

/**
 * @type {import("./engines/engine.mjs").Regex | null}
 */
let regex = await engine.compile(regexInput.value);
regexInput.addEventListener("input", async (event) => {
  try {
    if (regex !== null) {
      regex.drop();
    }

    if (event.target === null) {
      throw new Error("null event target");
    }
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error("event target of unexpected type");
    }

    regex = await engine.compile(event.target.value);
    compileError.textContent = "";
    await updateMatches(corpusInput.textContent ?? "");
  } catch (err) {
    if (!(err instanceof SyntaxError)) {
      throw err;
    }

    regex = null;
    compileError.textContent = err.message;
  }
});

corpusInput.addEventListener("input", async (event) => {
  if (regex === null) {
    return;
  }

  if (event.target === null) {
    throw new Error("null event target");
  }
  if (!(event.target instanceof Element)) {
    throw new Error("event target of unexpected type");
  }

  await updateMatches(event.target.textContent ?? "");
});
