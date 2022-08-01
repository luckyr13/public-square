import { Component, OnInit } from '@angular/core';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { UserAuthService } from '../../core/services/user-auth.service';
import { UserSettingsService } from '../../core/services/user-settings.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  appName = '';
  appVersion = '';
  protocolVersion = '';
  sessionData: {localStorage: Storage, sessionStorage: Storage};
  isDarkTheme = false;

  constructor(
    private _appSettings: AppSettingsService,
    private _userAuth: UserAuthService,
    private _userSettings: UserSettingsService) {
    this.appName = this._appSettings.protocolName;
    this.appVersion = this._appSettings.appVersion;
    this.protocolVersion = this._appSettings.protocolVersion;
    this.sessionData = this._userAuth.getSessionData();
  }

  ngOnInit(): void {
    this.isDarkTheme = this._userSettings.isDarkTheme(this._userSettings.getDefaultTheme());
    this._userSettings.currentThemeStream.subscribe((theme) => {
      this.isDarkTheme = this._userSettings.isDarkTheme(theme);
    });
  }

  deleteSes() {
    this._userAuth.destroySession();
  }

}