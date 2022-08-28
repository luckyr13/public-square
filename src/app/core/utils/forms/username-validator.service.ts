import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors  } from '@angular/forms';
import { map, catchError, of, Observable } from 'rxjs';
import { ProfileService } from '../../services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class UsernameValidatorService implements AsyncValidator {
  constructor(private _profile: ProfileService,) {}

  validate(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return this._profile.getProfileByHandle(control.value).pipe(
      map(profiles => {
        console.log('profiles', profiles)
        return (profiles && profiles.length ?
                  { uniqueUsername: false } :
                  null
                )
      }),
      catchError(
        (err) => {
          console.error('ErrValidatingUser:', err);
          return of(null);
        }
      )
    );
  }
}
