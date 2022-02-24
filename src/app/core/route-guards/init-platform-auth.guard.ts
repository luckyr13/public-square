import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { UserAuthService } from '../../core/services/user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class InitPlatformAuthGuard implements CanActivate, CanActivateChild {

  constructor(private _auth: UserAuthService, private _userSettings: UserSettingsService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this._auth.loadAccount();

    return true;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Display toolbar and main menu
    this._userSettings.setShowMainToolbar(true);
    return true;
  }
  
}
