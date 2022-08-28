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
import { UserProfile } from '../../core/interfaces/user-profile';
import { ArProfile } from 'arweave-account';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  mainAddress = '';
  loginMethod = '';
  addressFromRoute = '';
  validatingUsername = false;
  errorMsgUsername = '';
  profile: UserProfile|undefined = undefined;
  private _loadingProfileSubscription = Subscription.EMPTY;
  profileImage = 'assets/images/blank-profile.jpg';
  profileImageTX = '';
  loadingSavingProfile = false;
  private _savingProfileSubscription = Subscription.EMPTY;
  profileFrm = new FormGroup({
    'username': new FormControl('', {
      validators: [Validators.required]
    }),
    'name': new FormControl(''),
    'bio': new FormControl(''),
    'twitter': new FormControl(''),
    'github': new FormControl(''),
    'instagram': new FormControl(''),
    'facebook': new FormControl(''),
    'youtube': new FormControl(''),
    'discord': new FormControl('')
  });
  defaultProfileImage = 'assets/images/blank-profile.jpg';

  constructor(
    private _userSettings: UserSettingsService,
    private _auth: UserAuthService,
    private _dialog: MatDialog,
    private _arweave: ArweaveService,
    private _appSettings: AppSettingsService,
    private _profile: ProfileService,
    private _utils: UtilsService,
    private _route: ActivatedRoute) { }

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
  get youtube() {
    return this.profileFrm.get('youtube')!;
  }
  get discord() {
    return this.profileFrm.get('discord')!;
  }

  ngOnInit(): void {
    this._appSettings.scrollTo('ww-mat-sidenav-main-content', 400);
    this.mainAddress = this._auth.getMainAddressSnapshot();
    this.loginMethod = this._auth.loginMethod;
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
      this.loginMethod = this._auth.loginMethod;
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
        this.profileImageTX = obj.id;
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
        this.profileImageTX = obj.id;
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
    this.profileImageTX = '';
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
    this.youtube.setValue('');
    this.discord.setValue('');
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
    this.loadingSavingProfile = true;
    const address = this.mainAddress;
    const jwk = this._auth.getPrivateKey();
    const newProfile: ArProfile = {
      handleName: this.profile && this.profile.handleName ? this.profile.handleName : '',
      avatar: this.profile && this.profile.avatar ? this.profile.avatar : '',
      avatarURL: '',
      banner: this.profile && this.profile.banner ? this.profile.banner : '',
      bannerURL: '',
      name: this.profile && this.profile.name ? this.profile.name : '',
      bio: this.profile && this.profile.bio ? this.profile.bio : '',
      email: this.profile && this.profile.email ? this.profile.email : '',
      links: this.profile && this.profile.links ? JSON.parse(JSON.stringify(this.profile.links)) : {},
      wallets: this.profile && this.profile.wallets ? JSON.parse(JSON.stringify(this.profile.wallets)) : {},
    };

    if (this.profileImageTX.trim()) {
      newProfile.avatar = `ar://${this.profileImageTX.trim()}`;
    }
    if (this.username.value!.trim()) {
      newProfile.handleName = `${this.username.value!.trim()}`;
    }
    if (this.name.value!.trim()) {
      newProfile.name = `${this.name.value!.trim()}`;
    }
    if (this.bio.value!.trim()) {
      newProfile.bio = `${this.bio.value!.trim()}`;
    }
    if (this.twitter.value!.trim()) {
      newProfile.links['twitter'] = `${this.twitter.value!.trim()}`;
    }
    if (this.youtube.value!.trim()) {
      newProfile.links['youtube'] = `${this.youtube.value!.trim()}`;
    }
    if (this.github.value!.trim()) {
      newProfile.links['github'] = `${this.github.value!.trim()}`;
    }
    if (this.instagram.value!.trim()) {
      newProfile.links['instagram'] = `${this.instagram.value!.trim()}`;
    }
    if (this.facebook.value!.trim()) {
      newProfile.links['facebook'] = `${this.facebook.value!.trim()}`;
    }
    if (this.discord.value!.trim()) {
      newProfile.links['discord'] = `${this.discord.value!.trim()}`;
    }

    this._savingProfileSubscription = this._profile.updateProfile(newProfile).subscribe({
      next: (tx) => {
        if (tx && tx.id) {
          this._utils.message(`Success! Tx id: ${tx.id}`, 'success');
        }
        this.loadingSavingProfile = false;
      },
      error: (error) => {
        console.error('OnSubmit', error);
        this._utils.message('Error!', 'error');
        this.loadingSavingProfile = false;
      }
    })


  }

  fillProfileFrm(profile: UserProfile|undefined|null) {
    this.resetFrmValues();
    if (profile) {
      const image = profile.avatarURL ? profile.avatarURL.trim() : this.defaultProfileImage;
      const username = profile.handleName ? profile.handleName.trim() : '';
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
      const youtube = links && Object.prototype.hasOwnProperty.call(links, 'youtube') ?
        links['youtube'].trim() : '';
      const discord = links && Object.prototype.hasOwnProperty.call(links, 'discord') ?
        links['discord'].trim() : '';

      this.profileImage = image;
      this.username.setValue(username);
      this.name.setValue(name);
      this.bio.setValue(bio);
      this.twitter.setValue(twitter);
      this.facebook.setValue(facebook);
      this.github.setValue(github);
      this.instagram.setValue(instagram);
      this.youtube.setValue(youtube);
      this.discord.setValue(discord);
    }
  }
}