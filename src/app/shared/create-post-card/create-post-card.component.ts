import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-post-card',
  templateUrl: './create-post-card.component.html',
  styleUrls: ['./create-post-card.component.scss']
})
export class CreatePostCardComponent implements OnInit {
	message = new FormControl('');

  constructor() { }

  ngOnInit(): void {
  }

}
