import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
declare const window: any;
declare const document: any;

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
	private _defaultTheme: string = '';
	private _defaultLang: string = '';
  private _loadingPlatform: Subject<boolean> = new Subject<boolean>();
  public loadingPlatform$ = this._loadingPlatform.asObservable();
  private _showMainToolbar: Subject<boolean> = new Subject<boolean>();
  public showMainToolbar$ = this._showMainToolbar.asObservable();
  private _storage = window.localStorage;
  public themes: Record<string, any> = {
    'light-theme': {
      id: 'light-theme',
      dark: false
    },
    'dark-theme': {
      id: 'dark-theme',
      dark: true
    },
    'teal-theme': {
      id: 'teal-theme',
      dark: false
    },
    'dark-indigo-theme': {
      id: 'dark-indigo-theme',
      dark: true
    },
  };

  constructor() {
  	const dtheme = this._storage.getItem('defaultTheme');
  	const dlang = this._storage.getItem('defaultLang');
    this.setLoadingPlatform(false);
    this.setShowMainToolbar(false);

  	// Default settings
  	if (dtheme) {
  		this.setTheme(dtheme);
  	} else {
  		this.setTheme('light-theme');
  	}
  	if (dlang) {
  		this.setDefaultLang(dlang);
  	}

  }

  setLoadingPlatform(_isLoading: boolean) {
    this._loadingPlatform.next(_isLoading);
  }

  setShowMainToolbar(_show: boolean) {
    this._showMainToolbar.next(_show);
  }

  getDefaultTheme(): string {
  	return this._defaultTheme;
  }

  getDefaultLang(): string {
  	return this._defaultLang;
  }

  setDefaultTheme(_theme: string) {
  	if (_theme) {
    	this._defaultTheme = _theme;
    	this._storage.setItem('defaultTheme', this._defaultTheme);
      this.updateBodyClass(_theme);
  	}
  }

  setDefaultLang(_lang: string) {
  	if (_lang) {
  		this._defaultLang = _lang;
    	this._storage.setItem('defaultLang', this._defaultLang);
  	}
  }

  resetUserSettings() {
  	this._defaultLang = 'EN';
  	this._defaultTheme = 'light-theme';
  	this._storage.removeItem('defaultTheme');
  	this._storage.removeItem('defaultLang');

  }

  /*
  *  Set default theme (Updates the href property)
  */
  setTheme(theme: string) {
    switch (theme) {
      case 'light-theme':
        this.setDefaultTheme(theme);
      break;
      case 'dark-theme':
        this.setDefaultTheme(theme);
      break;
      case 'teal-theme':
        this.setDefaultTheme(theme);
      break;
      case 'dark-indigo-theme':
        this.setDefaultTheme(theme);
      break;
      default:
      	throw Error('Theme not found!');
      break;
    }
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
