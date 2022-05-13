import { Panel, showPanel, EditorView } from "@codemirror/view";
import { Text } from "@codemirror/state";


/*
* From: https://codemirror.net/6/examples/panel/
*/
function countWords(doc: Text) {
  let count = 0, iter = doc.iter()
  while (!iter.next().done) {
    let inWord = false
    for (let i = 0; i < iter.value.length; i++) {
      let word = /\w/.test(iter.value[i])
      if (word && !inWord) count++
      inWord = word
    }
  }
  return `Word count: ${count}`
}

function wordCountPanel(view: EditorView): Panel {
  let dom = document.createElement("div")
  dom.textContent = countWords(view.state.doc)
  dom.className = "cm-data-info-panel"
  return {
    dom,
    update: (update) => {
      if (update.docChanged) {
        dom.textContent = countWords(update.state.doc)
      }
    }
  }
}

function dataCountPanel(view: EditorView): Panel {
  const storyMaxSizeBytes = 100000;
  let dom = document.createElement("div")
  dom.textContent = countData(view.state.doc)
  dom.className = "cm-data-info-panel"
  return {
    dom,
    update: (update) => {
      if (update.docChanged) {
        dom.textContent = countData(update.state.doc)
        // Update UI
        const numChars = view.state.doc.length;
        if (numChars >= storyMaxSizeBytes) {
          dom.className = "cm-data-info-panel-danger"
        } else if (numChars >= 1000) {
          dom.className = "cm-data-info-panel-warning"
        } else {
          dom.className = "cm-data-info-panel"

        }
      }
    }
  }
}

function countData(doc: Text) {
  let count = 0, iter = doc.iter();
  while (!iter.next().done) {
    count += new Blob([iter.value]).size;
  }
  return `${count} byte${count === 1 ? '' : 's'}`;
}

const dataInfoTheme = EditorView.baseTheme({
  '.cm-panels': {
    color: 'inherit !important',
    backgroundColor: 'inherit !important',
  },
  '.cm-data-info-panel': {
    padding: '5px 10px',
    color: 'inherit !important',
    backgroundColor: 'inherit !important',
    fontFamily: 'monospace',
    textAlign: 'right'
  },
  '.cm-data-info-panel-warning': {
    padding: '5px 10px',
    color: '#eed202 !important',
    backgroundColor: 'inherit !important',
    fontFamily: 'monospace',
    textAlign: 'right'
  },
  '.cm-data-info-panel-danger': {
    padding: '5px 10px',
    color: 'red !important',
    backgroundColor: 'inherit !important',
    fontFamily: 'monospace',
    textAlign: 'right'
  },
})

export function wordCounter() {
  return [showPanel.of(wordCountPanel), dataInfoTheme];
}

export function dataCounter() {
  return [showPanel.of(dataCountPanel), dataInfoTheme];
}