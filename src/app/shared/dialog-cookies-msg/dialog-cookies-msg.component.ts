import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserSettingsService } from '../../core/services/user-settings.service';

@Component({
  selector: 'app-dialog-cookies-msg',
  templateUrl: './dialog-cookies-msg.component.html',
  styleUrls: ['./dialog-cookies-msg.component.scss']
})
export class DialogCookiesMsgComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCookiesMsgComponent>,
    private _userSettings: UserSettingsService,
    private _router: Router) {

  }

  acceptCookies() {
    this._userSettings.setCookiesAccepted(true);
    this.dialogRef.close('accept');
  }

  learnMore() {
    this._router.navigate(['/', 'about', 'cookie-policy']);

  }
}