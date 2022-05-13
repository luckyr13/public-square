import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserAuthService } from '../../core/services/user-auth.service';
import { Subscription, EMPTY } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-sheet-login',
  templateUrl: './bottom-sheet-login.component.html',
  styleUrls: ['./bottom-sheet-login.component.scss']
})
export class BottomSheetLoginComponent implements OnInit, OnDestroy {
	loginSubscription: Subscription = Subscription.EMPTY;
  stayLoggedIn: boolean = false;
  loadingLogin = false;

  constructor(
  	private _auth: UserAuthService,
  	private _utils: UtilsService,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetLoginComponent>,
    private _router: Router,
  ) {}

  ngOnInit(): void {
  
  }

  /*
  *  @dev Destroy subscriptions
  */
  ngOnDestroy(): void {
		this.loginSubscription.unsubscribe();
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
    this.loadingLogin = true;
    if (walletOption === 'arweavewebwallet') {
      this.loadingLogin = false;
    }

  	this.loginSubscription = this._auth.login(walletOption, fileInput, this.stayLoggedIn).subscribe({
  		next: (address: string) => {
        this.loadingLogin = false;
        this._bottomSheetRef.dismiss(address);
        this._utils.message('Connection successful!', 'success');
  		},
  		error: (error) => {
        this.loadingLogin = false;
        this._utils.message(`Error: ${error}`, 'error');
        this._bottomSheetRef.dismiss('');

  		}
  	});
  }



}
