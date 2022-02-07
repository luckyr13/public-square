import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserAuthService } from '../../core/services/user-auth.service';
import { Subscription, EMPTY } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-sheet-login',
  templateUrl: './bottom-sheet-login.component.html',
  styleUrls: ['./bottom-sheet-login.component.scss']
})
export class BottomSheetLoginComponent implements OnInit, OnDestroy {
	login$: Subscription = Subscription.EMPTY;
  stayLoggedIn: boolean = false;

  constructor(
  	private _auth: UserAuthService,
  	private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetLoginComponent>,
    private _router: Router,
  ) {}

  ngOnInit(): void {
  
  }

  /*
  *  @dev Destroy subscriptions
  */
  ngOnDestroy(): void {
  	if (this.login$) {
  		this.login$.unsubscribe();
  	}
  }

  /*
  *  @dev Listen for click on HTML element
  */
  uploadFileListener(fileUploader: any) {
    fileUploader.click();
  }

  setStayLoggedIn(event: any) {
    this.stayLoggedIn = event.checked
  }

  /*
  *  @dev Select a method to connect wallet from modal (or bottom sheet)
  */
  login(walletOption: string, fileInput: any = null) {

  	this.login$ = this._auth.login(walletOption, fileInput, this.stayLoggedIn).subscribe({
  		next: (res: any) => {
        this._bottomSheetRef.dismiss(true);
        this.message('Welcome!', 'success');
  		},
  		error: (error) => {
        this.message(`Error: ${error}`, 'error');
        this._bottomSheetRef.dismiss(false);

  		}
  	});
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
