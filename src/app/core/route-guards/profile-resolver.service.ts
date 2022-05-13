import { Injectable } from '@angular/core';
import { VertoService } from '../services/verto.service';
import { Subscription, tap, Observable, of, EMPTY} from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import {
  Router, ActivatedRoute, ActivatedRouteSnapshot,
  ParamMap, Params, Resolve,
  RouterStateSnapshot } from '@angular/router';
import { UtilsService } from '../../core/utils/utils.service';
import { ArweaveService } from '../../core/services/arweave.service';
import { UserProfile } from '../../core/interfaces/user-profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolverService implements Resolve<UserProfile> {
  public profile: UserProfile|null = null;
  public loading = false;
 
  constructor(
    private _verto: VertoService,
    private _route: ActivatedRoute,
    private _utils: UtilsService,
    private _arweave: ArweaveService,
    private _router: Router
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<UserProfile> | Observable<never> {
    const address = route.paramMap.get('address') ?
      route.paramMap.get('address') :
      (
        route.parent && route.parent.paramMap.get('address') ?
        route.parent.paramMap.get('address') : ''
      );

    this.profile = null;
    this.loading = true;
    
    return this.loadProfile(address!).pipe(
        tap((profile) => {
          this.profile = profile;
          this.loading = false;
        }),
        catchError((error) => {
          console.error('ProfileResolver:', error);
          this.loading = false;
          this._router.navigate(['/', 'profile-not-found']);
          return EMPTY;
        })
      );
  }

  loadProfile(address: string): Observable<UserProfile> {
    return this._verto.getProfile(address).pipe(
        switchMap((profile) => {
          const newProfile: UserProfile = {
            address: '',
            profile: null
          };
          if (profile) {
            newProfile.profile = profile;
            newProfile.address = address;
          } else if (this._arweave.validateAddress(address)) {
            newProfile.address = address;
          } else {
            throw Error(`Profile not found/incorrect address ${address}`);
          }
          return of(newProfile);
        })
      );
  }

}
