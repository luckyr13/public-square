import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserSettingsService } from '../core/services/user-settings.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {
	theme = new FormControl('');

  constructor(
    private _userSettings: UserSettingsService,
    private _snackBar: MatSnackBar,) {

  }

  ngOnInit(): void {
    this.theme.setValue(this._userSettings.getDefaultTheme());
  }

  updateTheme(theme: string) {
  	try {
  		this._userSettings.setTheme(theme);
  	} catch (error) {
  		this.message(`Error: ${error}`, 'error');
  	}
  }

   /*
  *  Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 8000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

}
