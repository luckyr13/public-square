import { Component, OnInit, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as SimpleMDE from 'simplemde';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { EmojisComponent } from '../emojis/emojis.component';
import * as codemirror from 'codemirror';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-create-post-card',
  templateUrl: './create-post-card.component.html',
  styleUrls: ['./create-post-card.component.scss']
})
export class CreatePostCardComponent implements OnInit, OnDestroy, AfterViewInit {
  message = new FormControl('');
  simplemde: SimpleMDE|null = null;
  loading = true;
  emojisPortal: ComponentPortal<EmojisComponent>|null = null;
  overlayRef: OverlayRef|null = null;
  loadEditorSubscription: Subscription = Subscription.EMPTY;


  constructor(private _overlay: Overlay) {
    
  }

  ngOnInit(): void {
    

  }


  openEmojiMenu(editor: SimpleMDE) {
    const emojiMenu = document.getElementsByClassName('fa fa-smile-o')[0];
    if (!emojiMenu) {
      throw Error('EmojiMenu not available');
    }
    const positionStrategy = this._overlay.position().flexibleConnectedTo(emojiMenu).withPositions([
       {
         originX: 'end',
         originY: 'top',
         overlayX: 'center',
         overlayY: 'top',
         offsetY: 32
       }
     ]);

    this.overlayRef = this._overlay.create({
      hasBackdrop: true,
      disposeOnNavigation: true,
      scrollStrategy: this._overlay.scrollStrategies.close(),
      positionStrategy
    });

    this.emojisPortal = new ComponentPortal(EmojisComponent);
    this.overlayRef!.attach(this.emojisPortal);

    this.overlayRef.overlayElement.addEventListener('click', (event) => {
      const target = <HTMLElement>event.target;
      const emoji = target && target.classList.contains('emoji') ? target.innerHTML.trim() : '';
      const currentEditorValue = editor.codemirror.getValue();
      editor.codemirror.setValue(`${currentEditorValue}${emoji}`);
      this.closeEmojiMenu();
    });

    this.overlayRef!.backdropClick().subscribe(() => {
      this.closeEmojiMenu();
    });
    
  }

  closeEmojiMenu() {
    this.overlayRef!.dispose();
  }

  ngAfterViewInit() {
    const obs = new Observable((subscriber) => {
      this.loading = true;
      window.setTimeout(() => {
        try {
          this.simplemde = new SimpleMDE({
            element: (<any> this.message).nativeElement,
            toolbar: [
              "bold", "italic", "heading", "strikethrough", "|",
              "quote", "link", "image", "code", "|",
              {
                name: "emojis",
                action: (editor) => {
                  
                  this.openEmojiMenu(editor);
                },
                className: "fa fa-smile-o",
                title: "Add emoji",
              },
              "preview" ],
          });
          subscriber.next(true);
          subscriber.complete();
        } catch (error) {
          this.loading = false;
          console.log('Error loading editor: ', error);
          subscriber.error(error);
        }
        this.loading = false;
      }, 500)
    })

    this.loadEditorSubscription = obs.subscribe((res) => {
      // Done
    });
    
  }

  ngOnDestroy() {
    if (this.simplemde) {
      this.simplemde.toTextArea();
      this.simplemde = null;
    }
    this.loadEditorSubscription.unsubscribe();
  }

}
