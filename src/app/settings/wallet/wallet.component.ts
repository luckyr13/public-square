import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../core/services/user-auth.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { Direction } from '@angular/cdk/bidi';
import { BottomSheetLoginComponent } from '../../shared/bottom-sheet-login/bottom-sheet-login.component';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  mainAddress = '';

  constructor(
    private _userAuth: UserAuthService,
    private _userSettings: UserSettingsService,
    private _bottomSheet: MatBottomSheet,
  ) { }

  ngOnInit(): void {
    this.mainAddress = this._userAuth.getMainAddressSnapshot();
    this._userAuth.account$.subscribe((address) => {
      this.mainAddress = address;
    });
  }

  /*
  *  @dev Modal login (or bottom sheet)
  */
  login() {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const sheet = this._bottomSheet.open(BottomSheetLoginComponent, {
       direction: direction
    });

    sheet.afterDismissed().subscribe((address) => {
      // this.account = address;
    });
  }

}
