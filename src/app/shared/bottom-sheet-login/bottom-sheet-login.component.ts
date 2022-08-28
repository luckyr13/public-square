import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserAuthService } from '../../core/services/user-auth.service';
import { Subscription, EMPTY } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';
import { AddressKey } from '../../core/interfaces/address-key';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { 
  PasswordDialogComponent 
} from '../../shared/password-dialog/password-dialog.component';
import { SubtleCryptoService } from '../../core/utils/subtle-crypto.service';
import * as b64 from 'base64-js';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { Direction } from '@angular/cdk/bidi';
import { JWKInterface } from 'arweave/web/lib/wallet';

@Component({
  selector: 'app-bottom-sheet-login',
  templateUrl: './bottom-sheet-login.component.html',
  styleUrls: ['./bottom-sheet-login.component.scss']
})
export class BottomSheetLoginComponent implements OnInit, OnDestroy {
  loginSubscription: Subscription = Subscription.EMPTY;
  stayLoggedIn: boolean = false;
  loadingLogin = false;
  encryptSubscription = Subscription.EMPTY;

  constructor(
    private _auth: UserAuthService,
    private _utils: UtilsService,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetLoginComponent>,
    private _router: Router,
    private _dialog: MatDialog,
    private _crypto: SubtleCryptoService, 
    private _userSettings: UserSettingsService
  ) {}

  ngOnInit(): void {
  
  }

  /*
  *  @dev Destroy subscriptions
  */
  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
    this.encryptSubscription.unsubscribe();
  }

  /*
  *  @dev Listen for click on HTML element
  */
  uploadFileListener(fileUploader: any) {
    fileUploader.click();
  }

  setStayLoggedIn(event: any) {
    this.stayLoggedIn = event.checked
  }

  /*
  *  @dev Select a method to connect wallet from modal (or bottom sheet)
  */
  login(
    walletOption: 'arconnect'|'arweavewebwallet'|'finnie'|'pkFile',
    fileInputEvent?: Event) {
    this.loadingLogin = true;
    if (walletOption === 'arweavewebwallet') {
      this.loadingLogin = false;
    }

    this.loginSubscription = this._auth.login(walletOption, fileInputEvent, this.stayLoggedIn).subscribe({
      next: (address: string|AddressKey) => {
        // If pk
        if (walletOption === 'pkFile') {
          const tmpAddress = address as AddressKey;
          const target = <HTMLInputElement>(fileInputEvent!.target!);
          target.value = '';
          this.setPasswordDialog(tmpAddress);
            
        } else {
          this.loadingLogin = false;
          this._bottomSheetRef.dismiss(address);
          this._utils.message('Welcome!', 'success');
        }
        
      },
      error: (error) => {
        this.loadingLogin = false;
        this._utils.message(`Error: ${error}`, 'error');
        this._bottomSheetRef.dismiss('');

      }
    });
  }

  setPasswordDialog(tmpAddress: AddressKey) {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(PasswordDialogComponent, {
      data: {
        title: 'Set password',
        confirmLabel: 'Set password',
        closeLabel: 'Cancel'
      },
      disableClose: true,
      direction: direction
    });
    dialogRef.afterClosed().subscribe(password => {
      if (password) {
        // Save user data
        const data = JSON.stringify(tmpAddress.key);
        this._crypto.newSession(this.stayLoggedIn);
        this.encryptSubscription = this._crypto.encrypt(password, data).subscribe({
          next: (c) => {
            const encodedKey = b64.fromByteArray(new Uint8Array(c.c));
            const key: JWKInterface = JSON.parse(JSON.stringify(tmpAddress.key));
            this._auth.setAccount(
              tmpAddress.address,
              key,
              this.stayLoggedIn,
              'pkFile',
              encodedKey);
            this.loadingLogin = false;
            this._bottomSheetRef.dismiss(tmpAddress.address);
            this._utils.message('Welcome!', 'success');
          },
          error: (error) => {
            this._utils.message(error, 'error');
            this.loadingLogin = false;
          }
        });
        
        
        
      } else {
        this._auth.logout();
        this._utils.message('Bye, bye!', 'error');
        this.loadingLogin = false;
      }
    });
  }


}
