import { EditorState, StateField, StateEffect, Compartment } from '@codemirror/state'
import { EditorView, keymap, placeholder, highlightSpecialChars } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { Observable, Subject } from 'rxjs';
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { linkExtension } from '../utils/codemirror/link-extension';
import { dataCounter } from '../utils/codemirror/word-counter-extension';
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';

export class CodeMirrorWrapper {
  editorState: EditorState|null = null;
  editorView: EditorView|null = null;
  placeholderCompartment: Compartment = new Compartment();
  updateEffectsCompartment: Compartment = new Compartment();
  editableCompartment: Compartment = new Compartment();
  private _content: Subject<string>;
  public contentStream: Observable<string>;
  public content: string;

  constructor() {
    this._content = new Subject<string>();
    this.contentStream = this._content.asObservable();
    this.content = '';
  }

  init(container: any, placeholderTxt= 'What\'s on your mind?') {
    const obs = new Observable((subscriber) => {
      try {
      
        this.editorState = EditorState.create({
          doc: '',
          extensions: [
            history(),
            highlightSpecialChars(),
            bracketMatching(),
            closeBrackets(),
            this.placeholderCompartment.of(placeholder(placeholderTxt)),
            this.updateEffectsCompartment.of([]),
            keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
            syntaxHighlighting(defaultHighlightStyle),
            EditorView.lineWrapping,
            linkExtension(),
            this.editableCompartment.of(EditorView.editable.of(true)),
            dataCounter()
          ]
        });

        this.editorView = new EditorView({
          state: this.editorState,
          parent: container,
          
        });

        this.editorView.dispatch({
          effects: this.updateEffectsCompartment.reconfigure(EditorView.updateListener.of((upd) => {
            this.content = upd.state.doc.toString().trim();
            this._content.next(this.content);
          }))
        });

        subscriber.next();
        subscriber.complete();
        
      } catch (error) {
        subscriber.error(error);
      }

    });

    return obs;
  }

  updatePlaceholder(placeholderTxt: string) {
    if (this.editorView) {
      this.editorView.dispatch({
        effects: this.placeholderCompartment.reconfigure(placeholder(placeholderTxt))
      })
    }
  }

  editable(readOnly: boolean) {
    this.editorView!.dispatch({
      effects: this.editableCompartment.reconfigure(EditorView.editable.of(readOnly))
    })
  }

  resetEditor() {
    const text = this.editorView!.state.doc.toString();
    const size = text.length;
    const transaction = this.editorView!.state.update({
      changes: {from: 0, to: size, insert: ''}
    });
    this.editorView!.dispatch(transaction);
  }

  destroy() {
    this.editorView!.destroy();
  }

  insertText(s: string) {
    const transaction = this.editorView!.state.replaceSelection(s);
    this.editorView!.dispatch(transaction);
  }

}