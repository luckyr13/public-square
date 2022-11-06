import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveDialogsService {
  private _activeDialogFlag: Subject<boolean>;

  constructor() {
    this._activeDialogFlag = new Subject();
  }

  get isDialogActive(): Observable<boolean> {
    return this._activeDialogFlag.asObservable();
  }

  set activeDialog(flag: boolean) {
    this._activeDialogFlag.next(flag);
  }
}
