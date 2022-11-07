import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserAuthService } from '../core/services/user-auth.service';
import { Subscription } from 'rxjs';
import { ActiveDialogsService } from '../core/services/active-dialogs.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {
	account = '';
  accountSubscription: Subscription = Subscription.EMPTY;
  activeDialogFlag = false;

  constructor(
    private _auth: UserAuthService,
    private _activeDialogs: ActiveDialogsService) { }

  ngOnInit(): void {
    this.account = this._auth.getMainAddressSnapshot();
    this.accountSubscription = this._auth.account$.subscribe((account) => {
      this.account = account;
    });

    this._activeDialogs.isDialogActive.subscribe((active) => {
      if (active) {
        this.activeDialogFlag = true;
      } else {
        this.activeDialogFlag = false;
      }
    });
  }

  ngOnDestroy() {
    this.accountSubscription.unsubscribe();
  }

  getRouterLinkActiveClasses() {
    if (!this.activeDialogFlag) {
      return ['active', 'border-color-theme'];
    }

    return '';
  }

}
