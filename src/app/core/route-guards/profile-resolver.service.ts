import { Injectable } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Subscription, tap, Observable, of, EMPTY} from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import {
  Router, ActivatedRoute, ActivatedRouteSnapshot,
  ParamMap, Params, Resolve,
  RouterStateSnapshot } from '@angular/router';
import { UtilsService } from '../../core/utils/utils.service';
import { ArweaveService } from '../../core/services/arweave.service';
import { UserProfileAddress } from '../../core/interfaces/user-profile-address';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolverService implements Resolve<UserProfileAddress> {
  public profileAddress: UserProfileAddress|null = null;
  public loading = false;
 
  constructor(
    private _profile: ProfileService,
    private _route: ActivatedRoute,
    private _utils: UtilsService,
    private _arweave: ArweaveService,
    private _router: Router
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<UserProfileAddress> | Observable<never> {
    const address = route.paramMap.get('address') ?
      route.paramMap.get('address') :
      (
        route.parent && route.parent.paramMap.get('address') ?
        route.parent.paramMap.get('address') : ''
      );

    this.profileAddress = null;
    this.loading = true;
    
    return this.loadProfile(address!).pipe(
        tap((profile) => {
          this.profileAddress = profile;
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

  loadProfile(address: string): Observable<UserProfileAddress> {
    return this._profile.getProfileByAddress(address).pipe(
        switchMap((profile) => {
          const newProfile: UserProfileAddress = {
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
