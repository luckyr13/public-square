import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, Subscription } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { UtilsService } from '../../core/utils/utils.service';
import { UserSettingsService } from '../../core/services/user-settings.service';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss']
})
export class CookiePolicyComponent implements OnInit, OnDestroy {
  loading = false;
  getFileSubscription = Subscription.EMPTY;
  content = '';
  
  constructor(
    private _location: Location,
    private _http: HttpClient,
    private _utils: UtilsService,
    private _userSettings: UserSettingsService) {

  }

  ngOnInit() {
    const lang = this._userSettings.getDefaultLang();
    const url = `assets/policies/${lang}/cookie-policy.md`;
    this.loading = true;
    this.getFileSubscription = this.getMarkdownFile(url).pipe(
      catchError((error) => {
        console.error('Error loading data for lang ' + lang + ' retrying with default ...');
        const defaultUrl= `assets/policies/en/cookie-policy.md`;
        return this.getMarkdownFile(defaultUrl);
      })
    ).subscribe({
      next: (response) => {
        this.content = '';
        if (response.body) {
          this.content = this.markdownToHTML(response.body);
        }
        this.loading = false;
      },
      error: (error) => {
        if (Object.prototype.hasOwnProperty.call(error, 'message')) {
          this._utils.message(error.message, 'error');
        } else {
          this._utils.message('Error loading file!', 'error');
        }
        this.loading = false;
      }
    });
  }

  goBack() {
    this._location.back();
  }

  getMarkdownFile(_url: string) {
    return this._http.get(_url, {
      observe: 'response',
      responseType: 'text'
    });
  }

  ngOnDestroy() {
    this.getFileSubscription.unsubscribe();
  }

  markdownToHTML(_markdown: string) {
    return this._utils.markdownToHTML(_markdown);
  }
}
