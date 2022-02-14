import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit(): void {

  }

  goBack() {
  	this._location.back();
  }


}
