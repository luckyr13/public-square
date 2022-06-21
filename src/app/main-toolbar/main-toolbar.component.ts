import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { UserSettingsService } from '../core/services/user-settings.service';
import { UserAuthService } from '../core/services/user-auth.service';
import { BottomSheetLoginComponent } from '../shared/bottom-sheet-login/bottom-sheet-login.component';
import { Direction } from '@angular/cdk/bidi';
import { Router } from '@angular/router';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { AppSettingsService } from '../core/services/app-settings.service';
import { Subscription, Observable } from 'rxjs';
import { VertoService } from '../core/services/verto.service';
import { ArweaveService } from '../core/services/arweave.service';
import { UserInterface } from '@verto/js/dist/common/faces';
import { UtilsService } from '../core/utils/utils.service';


@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit, OnDestroy {
  theme = new UntypedFormControl('');
  @Output() toggleEvent = new EventEmitter<boolean>();
  account = '';
  method = '';
  appName: string;
  profileSubscription: Subscription = Subscription.EMPTY;
  profile: UserInterface|null = null;
  profileImage: string = 'assets/images/blank-profile.png';
  showThemeSelector = false;
  showSettingsSelector = true;

  constructor(
    private _userSettings: UserSettingsService,
    private _bottomSheet: MatBottomSheet,
    private _router: Router,
    private _auth: UserAuthService,
    private _appSettings: AppSettingsService,
    private _verto: VertoService,
    private _arweave: ArweaveService,
    private _utils: UtilsService) {
    this.appName = this._appSettings.appName;
  }

  ngOnInit(): void {
    this.theme.setValue(this._userSettings.getDefaultTheme());
    this._userSettings.currentThemeStream.subscribe((theme: string) => {
      this.theme.setValue(theme);
    });

    this._auth.account$.subscribe((address) => {
      if (address != '') {
        this.account = address;
        this.method = this._auth.loginMethod;
        this.profileSubscription = this._verto.getProfile(this.account).subscribe({
          next: (profile: UserInterface|undefined) => {
            if (profile) {
              this.profile = profile;
              if (profile.image) {
                this.profileImage = `${this._arweave.baseURL}${profile.image}`;
              }
            } else {
              this.profile = null;
              this.profileImage = 'assets/images/blank-profile.png';
            }
          },
          error: (error) => {
            this._utils.message(error, 'error');
          }
        });
      } else {
        this.account = '';
        this.method = '';
        this.profile = null;
        this.profileImage = 'assets/images/blank-profile.png';
      }
    });
  }

  ngOnDestroy() {
    this.profileSubscription.unsubscribe();
  }

  updateTheme(theme: string) {
    try {
      this._userSettings.setTheme(theme);
    } catch (error) {
      this._utils.message(`Error: ${error}`, 'error');
    }
  }

  toggle() {
    this.toggleEvent.emit(true);
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

  ellipsis(s: string) {
    return this._utils.ellipsis(s);
  }

  getTheme(theme: string) {
    return this._userSettings.getThemeObj(theme);
  }

  getThemesList() {
    return this._userSettings.themeNamesList.slice(
      0, this._userSettings.themeNamesList.length
    );
  }


}
