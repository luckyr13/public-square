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
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from '../../core/interfaces/user-profile';


@Component({
  selector: 'app-edit-profile-banner',
  templateUrl: './edit-profile-banner.component.html',
  styleUrls: ['./edit-profile-banner.component.scss']
})
export class EditProfileBannerComponent implements OnInit , OnDestroy {
  mainAddress = '';
  bannerImage = '';
  bannerTx = '';
  saveNewBannerImage = false;
  loadingSavingNewBannerImage = false;
  subscriptionSavingNewBannerImage = Subscription.EMPTY;
  private _profileSubscription = Subscription.EMPTY;
  addressFromRoute = '';
  profile: UserProfile|undefined = undefined;

  constructor(
    private _userSettings: UserSettingsService,
    private _auth: UserAuthService,
    private _dialog: MatDialog,
    private _arweave: ArweaveService,
    private _appSettings: AppSettingsService,
    private _profile: ProfileService,
    private _utils: UtilsService,
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._appSettings.scrollTo('ww-mat-sidenav-main-content', 400);
    this.mainAddress = this._auth.getMainAddressSnapshot();
    this._route.parent!.data.subscribe((data) => {
      const profileObj = data && Object.prototype.hasOwnProperty.call(data, 'profile') ?
        data['profile'] : {};
      const address = profileObj && profileObj.hasOwnProperty('address') ?
        profileObj['address'] : '';
      const profile = profileObj && profileObj.hasOwnProperty('profile') && 
        profileObj['profile'] ?
        profileObj['profile'] : {};

      this.addressFromRoute = address;
      this.profile = profile;
      this.loadBannerImage(this.mainAddress);

    });
    this._auth.account$.subscribe((account: string) => {
      this.mainAddress = account;
      if (account) {
        this.loadBannerImage(this.mainAddress);
      } else {
        this.removeBannerImage(false);
      }
    });
    
    
  }

  fileManager(type: string) {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(
      FileManagerDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          type: type,
          address: this.mainAddress
        },
        direction: direction,
        width: '800px'
      });

    // Manually restore focus to the menu trigger
    dialogRef.afterClosed().subscribe((res: {id: string, type:'text'|'image'|'audio'|'video'|''}) => { 
      if (res) {
        const obj = {
          id: res.id,
          type: res.type,
          content: ''
        };

        this.saveNewBannerImage = true;
        this.bannerImage = this.getImageUrl(obj.id);
        this.bannerTx = obj.id;
      }
    });
  }

  uploadFile(type: string) {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(
      UploadFileDialogComponent,
      {
        restoreFocus: false,
        autoFocus: true,
        disableClose: true,
        data: {
          type: type,
          address: this.mainAddress
        },
        direction: direction,
        width: '800px'
      }
    );

    // Manually restore focus to the menu trigger
    dialogRef.afterClosed().subscribe((res: { id: string, type: 'text'|'image'|'audio'|'video'|'' }|null|undefined) => {
      if (res) {
        const obj = {
          id: res.id,
          type: res.type,
          content: ''
        };
        this.saveNewBannerImage = true;
        this.bannerImage = this.getImageUrl(obj.id);
        this.bannerTx = obj.id;
      }
    });
  }

  saveBannerImage() {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';
    this.loadingSavingNewBannerImage = false;

    const dialogRef = this._dialog.open(
      ConfirmationDispatchDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          address: this.mainAddress,
          msg: `Confirm new banner image? (A new tx is gonna be created). New image: ${this.bannerTx}`,
          dataSize: 100
        },
        direction: direction,
        width: '800px'
      });

    // Manually restore focus to the menu trigger
    dialogRef.afterClosed().subscribe((res: { success: boolean, useDispatch: boolean }) => { 
      if (res.success) {
        this.loadingSavingNewBannerImage = true;
        try {
          this.subscriptionSavingNewBannerImage = this._profile.saveBannerImage(
            this.bannerTx,
            !res.useDispatch
          ).subscribe({
            next: (res) => {
              const txId = res.id;
              this._utils.message(`Success ${txId}`, 'success');
              this.loadingSavingNewBannerImage = false;
            },
            error: (error) => {
              this._utils.message('Error!', 'error');
              this.loadingSavingNewBannerImage = false;
              console.error(error);
            }
          })
        } catch (error) {
          this._utils.message('Error!', 'error');
          this.loadingSavingNewBannerImage = false;
          console.error(error);
        }
        
      }
    });
  }

  getImageUrl(txId: string) {
    return this._arweave.getImageUrl(txId);
  }

  removeBannerImage(saveNewBannerImage: boolean) {
    this.bannerImage = '';
    this.bannerTx = '';
    this.saveNewBannerImage = saveNewBannerImage;
  }

  ngOnDestroy() {
    this.subscriptionSavingNewBannerImage.unsubscribe();
  }

  
  loadBannerImage(from: string|string[]) {
    const limit = 10;
    this.removeBannerImage(false);
    this._profileSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._profile.getBannerImg(from, limit, currentHeight);
      })
    ).subscribe({
      next: (tx: TransactionMetadata[]) => {
        const txFirst = tx[0];
        const tags = txFirst && txFirst.tags ? txFirst.tags : [];
        const img = this._utils.sanitizeFull(this.findTag(tags, 'Img-Src-Id')); 
        this.bannerImage = '';
        this.bannerTx = '';

        if (img && this._arweave.validateAddress(img)) {
          this.bannerImage = this.getImageUrl(img);
          this.bannerTx = img;
        }

      },
      error: (error) => {
        console.error('BannerImg', error);
      }
    });
  }

  findTag(tags: {name: string, value: string}[], needle: string): string {
    for (const t of tags) {
      // Get metadata
      if (t.name === needle) {
        const value = t.value ? t.value.trim() : '';
        return value;
      }
    }
    return '';
  }

  isValidUser() {
    let res = false;
    const profileAddresses = this.profile && this.profile.address ?
      [this.profile.address] : [];
    const username = this.profile && this.profile.username ?
      this.profile.username : '';
    if (((this.addressFromRoute === username ||
          profileAddresses.findIndex(v => v === this.addressFromRoute) >= 0) &&
          profileAddresses.findIndex(v => v === this.mainAddress) >= 0) ||
        this.addressFromRoute === this.mainAddress) {
      res = true;
    }
    return res;
  }

}
