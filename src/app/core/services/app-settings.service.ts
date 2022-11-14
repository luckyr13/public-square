import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
declare const window: any;
declare const document: any;

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  appName = 'Public Square';
  appVersion = '0.2.9';

  // Dev protocol
  // protocolVersion = '0.0-dev';

  // Prod protocol
  protocolVersion = '2';
  protocolName = 'PublicSquare';

  private _loadingPlatform: Subject<boolean> = new Subject<boolean>();
  public loadingPlatform$ = this._loadingPlatform.asObservable();
  private _showMainToolbar: Subject<boolean> = new Subject<boolean>();
  public showMainToolbar$ = this._showMainToolbar.asObservable();

  // Observable string sources
  private _scrollTopSource = new Subject<number>();

  // Observable string streams
  public scrollTopStream = this._scrollTopSource.asObservable();

  supportedFiles: Record<string, string[]> = {
    'text': [
      'text/plain'
    ],
    'image': [
      'image/gif', 'image/png',
      'image/jpeg', 'image/bmp',
      'image/webp'
    ],
  };

  /*
  *  Default: 
  *  Story: 100kb = 100000b
  */
  storyMaxSizeBytes = 100000;

  public updateScrollTop(_scroll: number) {
    this._scrollTopSource.next(_scroll);
  }

  constructor() { }
  
  setLoadingPlatform(_isLoading: boolean) {
    this._loadingPlatform.next(_isLoading);
  }

  setShowMainToolbar(_show: boolean) {
    this._showMainToolbar.next(_show);
  }


  scrollPageToTop() {
    const container = document.getElementById('ww-mat-sidenav-main-content');
    if (container) {
      container.scrollTop = 0;
    }
  }

  scrollTo(to_id: string, offset: number = 0) {
    const container = document.getElementById('ww-mat-sidenav-main-content');
    const to = document.getElementById(to_id);
    const toData = to.getBoundingClientRect();
    container.scrollTop += toData.top + offset;
  }
}
