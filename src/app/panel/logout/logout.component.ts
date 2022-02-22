import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../core/services/user-auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
  	private _auth: UserAuthService,
  	private _router: Router) { }

  ngOnInit(): void {
  	this._auth.logout();
  	this._router.navigate(['']);
  }

}
