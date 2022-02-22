import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../core/services/user-auth.service';
@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
	account = this._auth.account$;

  constructor(private _auth: UserAuthService) { }

  ngOnInit(): void {
  }

}
