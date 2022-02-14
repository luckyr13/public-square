import { Component, OnInit, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as SimpleMDE from 'simplemde';

@Component({
  selector: 'app-create-post-card',
  templateUrl: './create-post-card.component.html',
  styleUrls: ['./create-post-card.component.scss']
})
export class CreatePostCardComponent implements OnInit, OnDestroy, AfterViewInit {
	message = new FormControl('');
  simplemde: SimpleMDE|null = null;
  loading = true;

  constructor(private _elementRef: ElementRef) {
  	
    
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.loading = true;
    window.setTimeout(() => {
      this.simplemde = new SimpleMDE({ element: (<any> this.message).nativeElement });
      this.loading = false;
    }, 500);
    
  }

  ngOnDestroy() {
  	this.simplemde!.toTextArea();
		this.simplemde = null;
  }

}
