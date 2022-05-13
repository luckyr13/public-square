import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { UtilsService } from '../../core/utils/utils.service';
import { LanguageService, LanguageObj } from '../../core/services/language.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  currentLang: string;
  langCodes: string[] = [];

  constructor(
    private _userSettings: UserSettingsService,
    private _lang: LanguageService,
    private _utils: UtilsService) {
    this.currentLang = this._userSettings.getDefaultLang();

    this.langCodes = this._userSettings.langCodesList;
  }

  getLangObj(langCode: string): LanguageObj {
    return this._lang.getLangObject(langCode)!;
  }

  ngOnInit(): void {
    this._userSettings.currentLangStream.subscribe(this.setLanguage);
  }

  setLanguage(langCode: string) {
    this._userSettings.setDefaultLang(langCode);
    this.currentLang = langCode;
  }

}
