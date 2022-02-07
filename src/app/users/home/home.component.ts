import { Component, OnInit } from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { BottomSheetLoginComponent } from '../../shared/bottom-sheet-login/bottom-sheet-login.component';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { Direction } from '@angular/cdk/bidi';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private _bottomSheet: MatBottomSheet,
    private _userSettings: UserSettingsService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

	/*
  *  @dev Modal login (or bottom sheet)
  */
  login() {
    const defLang = this._userSettings.getDefaultLang();
    /*
    let direction: Direction = defLang.writing_system === 'LTR' ? 
      'ltr' : 'rtl';
    */

    const sheet = this._bottomSheet.open(BottomSheetLoginComponent//, {
      // direction: direction
    //}
    );

    sheet.afterDismissed().subscribe((success) => {
      if (success) {
        this._router.navigate(['dashboard']);
      }
    });
  }
}
