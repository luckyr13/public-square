import { Component, OnInit, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as SimpleMDE from 'simplemde';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { EmojisComponent } from '../emojis/emojis.component';

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


  constructor(private _overlay: Overlay) {
  	
  }

  ngOnInit(): void {
    

  }


  openEmojiMenu() {
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

    this.overlayRef!.backdropClick().subscribe(() => {
      this.closeEmojiMenu();
    });
    
  }

  closeEmojiMenu() {
    this.overlayRef!.dispose();
  }

  ngAfterViewInit() {
    this.loading = true;
    window.setTimeout(() => {
      this.simplemde = new SimpleMDE({
        element: (<any> this.message).nativeElement,
        toolbar: [
          "bold", "italic", "heading", "strikethrough", "|",
          "quote", "link", "image", "code", "|",
          {
            name: "emojis",
            action: (editor) => {
              
              this.openEmojiMenu();
            },
            className: "fa fa-smile-o",
            title: "Add emoji",
          },
          "preview" ],
      });


      
      this.loading = false;
    }, 500);
    
  }

  ngOnDestroy() {
  	this.simplemde!.toTextArea();
		this.simplemde = null;
  }

}
