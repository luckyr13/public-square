import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreatePostDialogComponent } from '../shared/create-post-dialog/create-post-dialog.component'; 
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { UserSettingsService } from '../core/services/user-settings.service';
import { UserAuthService } from '../core/services/user-auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ActiveDialogsService } from '../core/services/active-dialogs.service';

@Component({
  selector: 'app-composed-create-post-dialog',
  templateUrl: './composed-create-post-dialog.component.html',
  styleUrls: ['./composed-create-post-dialog.component.scss']
})
export class ComposedCreatePostDialogComponent implements OnInit, OnDestroy {
  account = '';
  accountSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private _auth: UserAuthService,
    private _dialog: MatDialog,
    private _userSettings: UserSettingsService,
    private _router: Router,
    private _activeDialogs: ActiveDialogsService) { }

  ngOnInit(): void {
    this.account = this._auth.getMainAddressSnapshot();
    this.accountSubscription = this._auth.account$.subscribe((account) => {
      this.account = account;
    });
    if (this.account) {
      this.openCreatePostDialog();
    } else {
      this.close();
    }
  }


  openCreatePostDialog() {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    this._activeDialogs.activeDialog = true;

    const dialogRef = this._dialog.open(
      CreatePostDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          account: this.account,
        },
        direction: direction,
        width: '600px'
      });

    dialogRef.afterClosed().subscribe((tx: string) => {
      this._activeDialogs.activeDialog = false;
      this.close();
    });
  }

  ngOnDestroy() {
    this.accountSubscription.unsubscribe();
  }

  close() {
    this._router.navigate([{ outlets: { popup: null }}]);
  }


}
