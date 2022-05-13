import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
declare const window: any;
declare const document: any;
import { TranslateService } from '@ngx-translate/core';
import { LanguageService, LanguageObj } from './language.service';
import { ThemesService, ThemeObject } from './themes.service';

interface SettingsObject {
  theme: string,
  lang: string
}

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private _settings: SettingsObject = {
    theme: '',
    lang: ''
  };
  private _storage = window.localStorage;
  private _currentThemeSource: Subject<string> = new Subject<string>();
  public currentThemeStream = this._currentThemeSource.asObservable();
  private _currentLangSource = new Subject<string>();
  public currentLangStream = this._currentLangSource.asObservable();
  public themes: Record<string, ThemeObject>;
  public languages: Record<string, LanguageObj>;

  constructor(
    private _translate: TranslateService,
    private _langService: LanguageService,
    private _themeService: ThemesService) {
    this.themes = this._themeService.themes;
    this.languages = this._langService.langs;
    let settings: SettingsObject|null = null;
    const tmpSettings = this._storage.getItem('settings');
    let dtheme = '';
    let dlang = '';
    try {
      settings = JSON.parse(tmpSettings); 
    } catch (error) {
      console.error('Error loading settings: ', error);
    }
    if (settings && Object.prototype.hasOwnProperty.call(settings, 'theme')) {
      dtheme = settings.theme;
      this.setTheme(dtheme);
    } else {
      this.setTheme('dark-blue-gray-theme');
    }
    if (settings && Object.prototype.hasOwnProperty.call(settings, 'lang')) {
      dlang = settings.lang;
      _translate.setDefaultLang(dlang.toLowerCase());
      this.setDefaultLang(dlang);
    } else {
      _translate.setDefaultLang('en');
      this.setDefaultLang('EN');
    }
  }

  get themeNamesList(): string[] {
    return Object.keys(this.themes);
  }

  getDefaultTheme(): string {
    return this._settings.theme;
  }

  getThemeObj(theme: string): ThemeObject {
    return this.themes[theme];
  }

  getDefaultLang(): string {
    return this._settings.lang;
  }

  get langCodesList(): string[] {
    return Object.keys(this.languages);
  }

  setDefaultTheme(_theme: string) {
    if (_theme) {
      this._settings.theme = _theme;
      this._storage.setItem('settings', JSON.stringify(this._settings));
      this.updateBodyClass(_theme);
      this._currentThemeSource.next(_theme);
    }
  }

  setDefaultLang(_lang: string) {
    if (_lang) {
      this._settings.lang = _lang;
      this._storage.setItem('settings', JSON.stringify(this._settings));
      this._translate.use(_lang.toLowerCase());
      this._currentLangSource.next(_lang);
      const langObj = this._langService.getLangObject(_lang)!;

      // Update index.html
      if (langObj) {
        document.documentElement.lang = langObj.code;
        if (langObj.writing_system) {
          document.documentElement.dir = langObj.writing_system;
        }
      }
    }
  }

  /*
  *  Set default theme (Updates the href property)
  */
  setTheme(theme: string) {
    const themes = this.themeNamesList;
    for (const t of themes) {
      if (theme === t) {
        this.setDefaultTheme(theme);
        return;
      }
    }
    console.error('UserSettings: Theme not found!');
  }

  updateBodyClass(className: string) {
    if (document.body) {
      document.body.className = className;
    }
  }

  isDarkTheme(theme: string) {
    return this.themes[theme].dark;
  }
  
}
