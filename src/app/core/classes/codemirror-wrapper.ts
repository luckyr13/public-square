import { EditorState, StateField, StateEffect} from '@codemirror/state';
import { EditorView, keymap, placeholder, highlightSpecialChars } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { history, historyKeymap } from '@codemirror/history';
import { Observable } from 'rxjs';
import { defaultHighlightStyle } from "@codemirror/highlight";
import { bracketMatching } from "@codemirror/matchbrackets";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets";
import { linkExtension } from '../utils/codemirror/link-extension';

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
	          	highlightSpecialChars(),
							bracketMatching(),
							closeBrackets(),
							placeholder('What\'s on your mind?'),
	          	keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
	          	defaultHighlightStyle.fallback,
	          	EditorView.lineWrapping,
	          	linkExtension(),
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