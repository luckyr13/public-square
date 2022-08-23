import { Component, OnInit, OnDestroy } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { FileManagerDialogComponent } from '../../shared/file-manager-dialog/file-manager-dialog.component'; 
import { UploadFileDialogComponent } from '../../shared/upload-file-dialog/upload-file-dialog.component';
import { UserSettingsService } from '../../core/services/user-settings.service';
import {MatDialog} from '@angular/material/dialog';
import { UserAuthService } from '../../core/services/user-auth.service';
import { ArweaveService } from '../../core/services/arweave.service';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { ConfirmationDispatchDialogComponent } from '../../shared/confirmation-dispatch-dialog/confirmation-dispatch-dialog.component';
import { ProfileService } from '../../core/services/profile.service';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UtilsService } from '../../core/utils/utils.service';
import { NetworkInfoInterface } from 'arweave/web/network';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  mainAddress = '';
  bannerImage = '';
  bannerTx = '';
  saveNewBannerImage = false;
  loadingSavingNewBannerImage = false;
  subscriptionSavingNewBannerImage = Subscription.EMPTY;
  private _profileSubscription = Subscription.EMPTY;
  profileImage = 'assets/images/blank-profile.jpg';

  constructor(
    private _userSettings: UserSettingsService,
    private _auth: UserAuthService,
    private _dialog: MatDialog,
    private _arweave: ArweaveService,
    private _appSettings: AppSettingsService,
    private _profile: ProfileService,
    private _utils: UtilsService) { }

  ngOnInit(): void {
    this.mainAddress = this._auth.getMainAddressSnapshot();
    this._auth.account$.subscribe((account: string) => {
      this.mainAddress = account;
    });
    this._appSettings.scrollTo('ww-mat-sidenav-main-content', 400);
  }

  ngOnDestroy() {
    
  }
  
}