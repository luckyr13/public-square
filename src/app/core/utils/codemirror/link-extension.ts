import {EditorView, Decoration, ViewPlugin, DecorationSet, ViewUpdate} from "@codemirror/view"
import {RangeSetBuilder} from "@codemirror/rangeset"
import {Extension} from "@codemirror/state"
import isUrl from 'validator/lib/isUrl';


const link = Decoration.mark({
  attributes: {class: "cm-link"}
});
const baseTheme = EditorView.baseTheme({
  ".cm-link": {color: "#0091f2"},
});

const addLinkDecoration = ViewPlugin.fromClass(class {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = linkDeco(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = linkDeco(update.view)
    }
  }
}, {
  decorations: v => v.decorations
});

function linkDeco(view: EditorView) {
  let builder = new RangeSetBuilder<Decoration>();
  for (let {from, to} of view.visibleRanges) {
    for (let pos = from; pos <= to;) {
      let line = view.state.doc.lineAt(pos);
      const links = getLinksByPosition(line.from, line.to, line.text);
      for (const cl of links) {
      	builder.add(cl.from, cl.to, link);
      }
      
      pos = line.to + 1;
    }
  }
  return builder.finish()
}

function getLinksByPosition(start: number, end: number, s: string) {
	const res: Array<{from: number, to: number}>= [];
	let inWord = false;
	let currentWord = '';
	const numCharacters = s.length;
	let i: number;
	for (i = 0; i < numCharacters; i++) {
		if (s[i].trim() !== '') {
			inWord = true;
			currentWord += s[i];
		} else {
			if (inWord) {
				if (isUrl(currentWord) || (currentWord.length && currentWord[0] === '#')) {
					res.push({from:  start + (i - currentWord.length), to: (start + i)});
				}
			}
			inWord = false;
			currentWord = '';
		}
	}

	if (inWord) {
		if (isUrl(currentWord) || (currentWord.length && currentWord[0] === '#')) {
			res.push({from:  start + (i - currentWord.length), to: (start + i)});
		}
	}

	return res;
}

export function linkExtension(options: {step?: number} = {}): Extension {
  return [
    baseTheme,
    addLinkDecoration
  ]
}