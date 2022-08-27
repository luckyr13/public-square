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
import { 
  FormGroup, FormControl, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsernameValidatorService } from '../../core/utils/forms/username-validator.service';
import { UserProfile } from '../../core/interfaces/user-profile';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  mainAddress = '';
  addressFromRoute = '';
  validatingUsername = false;
  errorMsgUsername = '';
  profile: UserProfile|undefined = undefined;
  private _loadingProfileSubscription = Subscription.EMPTY;
  profileImage = 'assets/images/blank-profile.jpg';
  loadingSavingProfile = false;
  private _savingProfileSubscription = Subscription.EMPTY;
  private _userExistsSubscription = Subscription.EMPTY;
  profileFrm = new FormGroup({
    'username': new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [this._usernameValidator.validate.bind(this._usernameValidator)],
      updateOn: 'blur',
    }),
    'name': new FormControl(''),
    'bio': new FormControl(''),
    'twitter': new FormControl(''),
    'github': new FormControl(''),
    'instagram': new FormControl(''),
    'facebook': new FormControl('')
  });

  constructor(
    private _userSettings: UserSettingsService,
    private _auth: UserAuthService,
    private _dialog: MatDialog,
    private _arweave: ArweaveService,
    private _appSettings: AppSettingsService,
    private _profile: ProfileService,
    private _utils: UtilsService,
    private _route: ActivatedRoute,
    private _usernameValidator: UsernameValidatorService) { }

  get username() {
    return this.profileFrm.get('username')!;
  }
  get name() {
    return this.profileFrm.get('name')!;
  }
  get bio() {
    return this.profileFrm.get('bio')!;
  }
  get twitter() {
    return this.profileFrm.get('twitter')!;
  }
  get facebook() {
    return this.profileFrm.get('facebook')!;
  }
  get github() {
    return this.profileFrm.get('github')!;
  }
  get instagram() {
    return this.profileFrm.get('instagram')!;
  }

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
      this.fillProfileFrm(profile);

    });

    this._auth.account$.subscribe((account: string) => {
      this.mainAddress = account;
      if (account) {
        this.loadProfile(this.mainAddress);
      } else {
        this.resetFrmValues();
      }
    });
    
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

  ngOnDestroy() {
    this._loadingProfileSubscription.unsubscribe();
    this._savingProfileSubscription.unsubscribe();
    this._userExistsSubscription.unsubscribe();
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

        this.profileImage = this.getProfileImageUrl(obj.id);
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
        this.profileImage = this.getProfileImageUrl(obj.id);
      }
    });
  }

  getProfileImageUrl(txId: string) {
    let img = this._arweave.getImageUrl(txId)
    if (!img) {
      img = 'assets/images/blank-profile.jpg';
    }
    return img;
  }

  removeProfileImage() {
    this.profileImage = 'assets/images/blank-profile.jpg';
  }

  resetFrmValues() {
    this.removeProfileImage();
    this.username.enable();
    this.username.setValue('');
    this.name.setValue('');
    this.bio.setValue('');
    this.twitter.setValue('');
    this.facebook.setValue('');
    this.github.setValue('');
    this.instagram.setValue('');
  }

  loadProfile(from: string) {
    this._loadingProfileSubscription = this._profile.getProfileByAddress(from).subscribe({
      next: (profile) => {
        this.fillProfileFrm(profile);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  submitProfile() {
    alert(JSON.stringify(this.profileFrm.value))
  }

  fillProfileFrm(profile: UserProfile|undefined|null) {
    this.resetFrmValues();
    if (profile) {
      const image = profile.avatarURL ? profile.avatarURL.trim() : '';
      const username = profile.username ? profile.username.trim() : '';
      const name = profile.name ? profile.name.trim() : '';
      const bio = profile.bio ? profile.bio.trim() : '';
      const addresses = profile.address ? [profile.address] : [];
      const links = profile.links ? profile.links : {};
      const twitter = links && Object.prototype.hasOwnProperty.call(links, 'twitter') ?
        links['twitter'].trim() : '';
      const facebook = links && Object.prototype.hasOwnProperty.call(links, 'facebook') ?
        links['facebook'].trim() : '';
      const github = links && Object.prototype.hasOwnProperty.call(links, 'github') ?
        links['github'].trim() : '';
      const instagram = links && Object.prototype.hasOwnProperty.call(links, 'instagram') ?
        links['instagram'].trim() : '';

      this.profileImage =  this.getProfileImageUrl(image);
      this.username.setValue(username);
      this.name.setValue(name);
      this.bio.setValue(bio);
      this.twitter.setValue(twitter);
      this.facebook.setValue(facebook);
      this.github.setValue(github);
      this.instagram.setValue(instagram);

      if (username) {
        this.username.disable();
      }
    }
  }
}