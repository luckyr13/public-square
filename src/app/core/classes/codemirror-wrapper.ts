import { EditorState } from '@codemirror/state';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { history, historyKeymap } from '@codemirror/history';
import { Observable } from 'rxjs';
import { defaultHighlightStyle } from "@codemirror/highlight";
import { bracketMatching } from "@codemirror/matchbrackets";
import { closeBrackets } from "@codemirror/closebrackets";

export class CodeMirrorWrapper {
	editorState: EditorState|null = null;
  editorView: EditorView|null = null;

  init(container: any) {
		const obs = new Observable((subscriber) => {
	    try {
	      window.setTimeout(() => {
	        this.editorState = EditorState.create({
	          doc: '',
	          extensions: [
	          	history(),
							bracketMatching(),
							closeBrackets(),
							placeholder('What\'s going on?'),
	          	keymap.of(defaultKeymap),
	          	keymap.of(historyKeymap),
	          	defaultHighlightStyle.fallback,
	          ]
	        });

	        this.editorView = new EditorView({
	          state: this.editorState,
	          parent: container
	        });

	        subscriber.next();
	        subscriber.complete();
	      }, 500);
	      
	    } catch (error) {
	      subscriber.error(error);
	    }

	  });

	  return obs;
  }

  

}