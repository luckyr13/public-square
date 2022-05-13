import { getVerification } from "arverify";
import { Injectable } from '@angular/core';
import { Observable, from, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArverifyMapService {
  _arverifyMap: Record<string, {verified: boolean, icon: string, percentage: number}> = {};

  constructor() {}

  getVerification(
    address: string
  ): Observable<{verified: boolean, icon: string, percentage: number}>
  {
    if (Object.prototype.hasOwnProperty.call(this._arverifyMap, address)) { 
      return of(this._arverifyMap[address]);
    }
    return from(getVerification(address)).pipe(
      tap((response) => {
        this._arverifyMap[address] = response;
      })
    );
  }
}
