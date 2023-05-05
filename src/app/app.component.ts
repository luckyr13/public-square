import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { AppSettingsService } from './core/services/app-settings.service';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserAuthService } from './core/services/user-auth.service';
import { UtilsService } from './core/utils/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { 
  ConfirmationDialogComponent 
} from './shared/confirmation-dialog/confirmation-dialog.component';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { UserSettingsService } from './core/services/user-settings.service';
import { LanguageService, LanguageObj } from './core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { AddressKey } from './core/interfaces/address-key';
import {
  PasswordDialogComponent 
} from './shared/password-dialog/password-dialog.component';
import { ArweaveService } from './core/services/arweave.service';
import { SubtleCryptoService } from './core/utils/subtle-crypto.service';
import { JWKInterface } from 'arweave/web/lib/wallet';
import * as b64 from 'base64-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  opened = true;
  platformLoading$: Observable<boolean>;
  loadAccountSubscription: Subscription = Subscription.EMPTY;
  loginSubscription: Subscription = Subscription.EMPTY;
  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;

  constructor(
    private _appSettings: AppSettingsService,
    private _userSettings: UserSettingsService,
    private _auth: UserAuthService,
    private _utils: UtilsService,
    private _lang: LanguageService,
    public dialog: MatDialog,
    private _translate: TranslateService,
    private _arweave: ArweaveService,
    private _crypto: SubtleCryptoService
  ) {
    this.platformLoading$ = this._appSettings.loadingPlatform$;
  }

  ngOnInit() {
    this.loadAccountSubscription = this._auth.loadAccount().subscribe({
      next: (success) => {
        if (success) {
          this._utils.message(`Welcome back!`, 'success');
        }
      },
      error: (error) => {
        if (error == 'Error: LaunchArweaveWebWalletModal') {
          // Resume session dialog
          this._translate.get('DIALOGS.RESUME_SESSION').subscribe((res: any) => {
            this.resumeSessionDialog(res.MESSAGE, res.CONFIRM, res.DISMISS);
          });
          

        }
        // Deprecated
        /*
        else if (error == 'Error: LaunchPasswordModal') {
          // Launch password modal
          this.passwordDialog();
        }
        */
        else {
          this._utils.message(error, 'error');
        }
      }
    });
    this.consoleWelcomeMessage();

  }


  ngOnDestroy() {
    this.loadAccountSubscription.unsubscribe();
  }

  toggle(val: boolean) {
    this.opened = !this.opened;
  }

  resumeSessionDialog(content: string, confirmLabel: string, closeLabel: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: '',
        content: content,
        confirmLabel: confirmLabel,
        closeLabel: closeLabel
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const stayLoggedIn = this._auth.getStayLoggedIn();
        // Throw Arweave Web Wallet dialog
        this.loginSubscription = this._auth.login(
          'arweavewebwallet',
          null,
          stayLoggedIn
        ).subscribe({
          next: (address: string|AddressKey) => {
            this._utils.message('Welcome!', 'success');
          },
          error: (error) => {
            this._utils.message(`Error: ${error}`, 'error');
          }
        });
      } else {
        await this._auth.logout();
      }
    });
  }

  ngAfterViewInit() {
    this.sidenavContainer.scrollable.elementScrolled().subscribe((ev) => {
      const target: any = ev.target;
      const scroll: number = target.scrollTop;
      this._appSettings.updateScrollTop(scroll);
    });
  }

  consoleWelcomeMessage() {
    console.log('%c👋🐘 Welcome to PublicSquare!', 'background: #6200ea; color: #FFFFFF; font-size: 32px; padding: 10px; margin-bottom: 20px;');
  
  }

  // Deprecated
  /*
  passwordDialog() {
    const dialogRef = this.dialog.open(PasswordDialogComponent, {
      data: {
        title: 'Resume session',
        confirmLabel: 'Login',
        closeLabel: 'Cancel'
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(password => {
      if (password) {
        const stayLoggedIn = this._auth.getStayLoggedIn();
        const storage = stayLoggedIn ? window.localStorage : window.sessionStorage;
        const arkey = storage.getItem('ARKEY')!;
        //const finalArKey = JSON.parse(this.b64_to_utf8(arkey));
        const ciphertext = b64.toByteArray(arkey);
        this._crypto.decrypt(password, ciphertext).subscribe({
          next: (p) => {
            let key: JWKInterface|undefined = undefined;
            try {
              key = JSON.parse(this._crypto.decodeTxtMessage(p.p));
              this._arweave.arweave.wallets.jwkToAddress(key).then((address) => {
                this._auth.setAccount(address, key, stayLoggedIn, 'pkFile', arkey);
              }).catch((reason) => {
                this._auth.logout();
                this._utils.message('Error loading key', 'error');
              });
            } catch (error) {
              this.passwordDialog();
              console.error('ErrPwdDialog', error)
            }
            

          },
          error: (error) => {
            this._utils.message(error, 'error');
          }
        });
        
        
      } else {
        this._auth.logout();
      }
    });
  }
  */
  
}
