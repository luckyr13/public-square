import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserAuthService } from '../core/services/user-auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {
	account = '';
  accountSubscription: Subscription = Subscription.EMPTY;

  constructor(private _auth: UserAuthService) { }

  ngOnInit(): void {
    this.account = this._auth.getMainAddressSnapshot();
    this.accountSubscription = this._auth.account$.subscribe((account) => {
      this.account = account;
    });
  }

  ngOnDestroy() {
    this.accountSubscription.unsubscribe();
  }

}
