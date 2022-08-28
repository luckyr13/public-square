import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileAddress } from '../../core/interfaces/user-profile-address';
import { ArweaveService } from '../../core/services/arweave.service';
import { UserAuthService } from '../../core/services/user-auth.service';
import { FollowDialogComponent } from '../../shared/follow-dialog/follow-dialog.component'; 
import {MatDialog} from '@angular/material/dialog';
import { Subscription, switchMap } from 'rxjs';
import { FollowService } from '../../core/services/follow.service';
import { NetworkInfoInterface } from 'arweave/web/network';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { Direction } from '@angular/cdk/bidi';
import { DonateDialogComponent } from '../../shared/donate-dialog/donate-dialog.component';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { ProfileService } from '../../core/services/profile.service';
import { UtilsService } from '../../core/utils/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileImage: string = 'assets/images/blank-profile.jpg';
  username: string = '';
  addressList: string[] = [];
  bio: string = '';
  name: string = '';
  addressRouteParam = '';
  editProfileFlag = false;
  isLoggedIn = false;
  maxFollowers = 9;
  maxFollowing = 9;
  maxFollowersQuery = 20;
  maxFollowingQuery = 20;
  numFollowers = 0;
  numFollowing = 0;
  private _followersSubscription = Subscription.EMPTY;
  private _followingSubscription = Subscription.EMPTY;
  private _profileSubscription = Subscription.EMPTY;
  bannerImage = '';
  bannerTx = '';

  constructor(
    private _route: ActivatedRoute,
    private _arweave: ArweaveService,
    private _auth: UserAuthService,
    private _dialog: MatDialog,
    private _follow: FollowService,
    private _userSettings: UserSettingsService,
    private _router: Router,
    private _profile: ProfileService,
    private _utils: UtilsService) { }

  ngOnInit(): void {
    // Profile already loaded
    this._route.data
    .subscribe(data => {
      const profile: UserProfileAddress = data['profile'];
      this.profileImage = 'assets/images/blank-profile.jpg';
      this.username = '';
      this.bio = '';
      this.addressList = [];
      this.name = '';

      if (profile.profile) {
        if (profile.profile.avatarURL) {
          this.profileImage = profile.profile.avatarURL;
        }
        this.name = profile.profile.name;
        this.username = profile.profile.username;
        this.bio = profile.profile.bio!;
        this.addressList = [profile.profile.address];
      } else if (profile.address) {
        this.addressList = [profile.address];
      }

      // Validate current user
      const currentAddress = this._auth.getMainAddressSnapshot();
      this.isLoggedIn = !!currentAddress;
      this.validateCurrentAddress(currentAddress);

      this.loadFollowers(this.addressList);
      this.loadFollowing(this.addressList);
      this.loadBannerImage(this.addressList);
      
    });

    this._route.paramMap.subscribe((params) => {
      this.addressRouteParam = params.get('address')!;
    });

    this._auth.account$.subscribe((currentAddress) => {
      this.isLoggedIn = !!currentAddress;
      this.validateCurrentAddress(currentAddress);
    });

  }

  validateCurrentAddress(currentAddress: string) {
    this.editProfileFlag = false;
    if (this.addressList.indexOf(currentAddress) >= 0) {
      this.editProfileFlag = true;
    }
  }

  confirmFollowDialog(username:string, wallets: string[]) {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(
      FollowDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          content: `Do you really want to follow ${username}?`,
          closeLabel: 'No',
          confirmLabel: 'Yes, I want to follow this user',
          wallets: wallets,
          username: username
        },
        direction: direction
      }
    );

    dialogRef.afterClosed().subscribe((confirm: string) => {
      
    });
  }

  loadFollowers(wallets: string|string[]) {
    this.numFollowers = 0;
    this._followersSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._follow.getFollowers(wallets, this.maxFollowersQuery, currentHeight);
      }),
    ).subscribe({
      next: (followers) => {
        this.numFollowers = (new Set(followers.map(f => f.owner))).size;
      },
      error: (error) => {
        console.error('ErrFollowers', error);
      }
    })

  }

  loadFollowing(from: string[]) {
    this.numFollowing = 0;
    this._followingSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._follow.getFollowing(from, this.maxFollowingQuery, currentHeight);
      }),
    ).subscribe({
      next: (following) => {
        const followingTmp: string[] = [];
        
        for (const f of following) {
          const infoAddresses = this.extractTagsFromTx(f);
          if (infoAddresses.username &&
              followingTmp.indexOf(infoAddresses.username) < 0) {
            followingTmp.push(infoAddresses.username);
            this.numFollowing++;
          } else if (!infoAddresses.username) {
            let flagWalletFound = false;
            for (const w of infoAddresses.wallets) {
              if (followingTmp.indexOf(w) < 0 && !flagWalletFound) {
                this.numFollowing++;
                flagWalletFound = true;
              }
              followingTmp.push(w);
            }

          }
        }

      },
      error: (error) => {
        console.error('ErrFollowing', error);
      }
    })
  }

  ngOnDestroy() {
    this._followingSubscription.unsubscribe();
    this._followersSubscription.unsubscribe();
    this._profileSubscription.unsubscribe();
  }


  donate() {
    const defLangCode = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLangCode);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';
    const mainAddress = this._auth.getMainAddressSnapshot();
    const to = this.addressList[0] ? this.addressList[0] : '';

    const dialogRef = this._dialog.open(DonateDialogComponent, {
      data: {
        mainAddress,
        to
      },
      direction: direction,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async (result) => {
    });
  }

  extractTagsFromTx(tx: TransactionMetadata): {username: string, wallets: string[]} {
    const tags = tx && tx.tags ? tx.tags : [];
    const res: {username: string, wallets: string[]} = { username: '', wallets: []};
    for (const t of tags) {
      if (t.name === 'Wallet') {
        if (this._arweave.validateAddress(t.value)) {
          res.wallets.push(t.value);
        } else {
          console.error('Invalid wallet tag', t);
        }
      } else if (t.name === 'Username') {
        res.username = t.value.trim();
      }
    }

    return res;
  }

  scrollToEditPage() {
    this._router.navigate(['/', this.addressList[0], 'edit']);
  }

  getImageUrl(txId: string) {
    return this._arweave.getImageUrl(txId);
  }
  
  loadBannerImage(from: string|string[]) {
    const limit = 10;
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
  

}
