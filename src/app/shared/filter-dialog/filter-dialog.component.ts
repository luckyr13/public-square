import { Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Subscription, tap, Observable, of, from, switchMap } from 'rxjs';
import { NetworkInfoInterface } from 'arweave/web/network';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { FollowService } from '../../core/services/follow.service';
import { ArweaveService } from '../../core/services/arweave.service';
import { UtilsService } from '../../core/utils/utils.service';
import { ProfileService } from '../../core/services/profile.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit, OnDestroy {
  private _profileSubscription = Subscription.EMPTY;
  public followers: Set<string> = new Set([]);
  private maxFollowers: number = 10;
  public loadingFollowers = false;
  private _followersSubscription = Subscription.EMPTY;
  private _nextResultsFollowersSubscription = Subscription.EMPTY;
  public addressList: Set<string> = new Set([]);
  public moreResultsAvailableFollowers = true;
  public following: Set<string> = new Set([]);
  private maxFollowing: number = 10;
  public loadingFollowing = false;
  private _followingSubscription = Subscription.EMPTY;
  private _nextResultsFollowingSubscription = Subscription.EMPTY;
  public moreResultsAvailableFollowing = true;
  public filterForm: FormGroup;

  constructor(
    private _arweave: ArweaveService,
    private _follow: FollowService,
    private _utils: UtilsService,
    private _dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      address: string,
      filterList: string[]
    },
    private _profile: ProfileService,
    private _fb: FormBuilder) {
    this.filterForm = this._fb.group({
      following: this._fb.group({
        aliases: this._fb.array([])
      }),
      followers: this._fb.group({
        aliases: this._fb.array([])
      })
    });
  }

  get aliasesFollowing() {
    return this.filterForm.get('following')!.get('aliases') as FormArray;
  }

  addAliasFollowing(v: boolean) {
    this.aliasesFollowing.push(this._fb.control(v));
  }

  get aliasesFollowers() {
    return this.filterForm.get('followers')!.get('aliases') as FormArray;
  }

  addAliasFollowers(v: boolean) {
    this.aliasesFollowers.push(this._fb.control(v));
  }

  ngOnInit(): void {
    this._profileSubscription = this._profile.getProfileByAddress(this.data.address).subscribe({
      next: (profile) => {
        const userAddressList = profile && profile.address ?
          [profile.address] :
          [this.data.address];
        const username = profile && profile.username ?
          profile.username :
          '';
        this.loadFollowers(userAddressList);
        this.loadFollowing(userAddressList);
          
      },
      error: (err) => {
        this._utils.message(err, 'error');
      }
    });
  }

  close(addressList: string[] = []) {
    this._dialogRef.close(addressList);
  }

  loadFollowers(wallets: string[]) {
    this.loadingFollowers = true;
    this.followers.clear();
    this._followersSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._follow.getFollowers(wallets, this.maxFollowers, currentHeight);
      })
    ).subscribe({
      next: (followers) => {
        if (!followers || !followers.length) {
          this.moreResultsAvailableFollowers = false;
        }
        for (const f of followers) {
          if (!this.followers.has(f.owner)) {
            if (this.data.filterList.indexOf(f.owner) >= 0) {
              this.addAliasFollowers(true);
            } else {
              this.addAliasFollowers(false);
            }
          }
          this.followers.add(f.owner);
        }
        this.loadingFollowers = false;
      },
      error: (error) => {
        this.loadingFollowers = false;
        this.moreResultsAvailableFollowers = false;
        this._utils.message(error, 'error');
      }
    })
  }

  moreResultsFollowers() {
    this.loadingFollowers = true;
    this._nextResultsFollowersSubscription = this._follow.next().subscribe({
      next: (followers) => {
        if (!followers || !followers.length) {
          this.moreResultsAvailableFollowers = false;
        }
        for (const f of followers) {
          if (!this.followers.has(f.owner)) {
            if (this.data.filterList.indexOf(f.owner) >= 0) {
              this.addAliasFollowers(true);
            } else {
              this.addAliasFollowers(false);
            }
          }
          this.followers.add(f.owner);
        }
        this.loadingFollowers = false;
      },
      error: (error) => {
        this.loadingFollowers = false;
        this._utils.message(error, 'error');
      }
    })
  }

  ngOnDestroy() {
    this._followersSubscription.unsubscribe();
    this._nextResultsFollowersSubscription.unsubscribe();
    this._profileSubscription.unsubscribe();
    this._followingSubscription.unsubscribe();
    this._nextResultsFollowingSubscription.unsubscribe();
  }

  loadFollowing(wallets: string[]) {
    this.loadingFollowing = true;
    this.following.clear();
    this._followingSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._follow.getFollowing(wallets, this.maxFollowing, currentHeight);
      })
    ).subscribe({
      next: (following) => {
        if (!following || !following.length) {
          this.moreResultsAvailableFollowing = false;
        }
        for (const f of following) {
          const tags = f.tags ? f.tags : [];
          for (const t of tags) {
            if (t.name === 'Wallet') {
              if (this._arweave.validateAddress(t.value)) {
                if (!this.following.has(t.value)) {
                  if (this.data.filterList.indexOf(t.value) >= 0) {
                    this.addAliasFollowing(true);
                  } else {
                    this.addAliasFollowing(false);
                  }
                }
                this.following.add(t.value);
              } else {
                console.error('Invalid Substory tag', t);
              }
            }
          }
        }
        this.loadingFollowing = false;
      },
      error: (error) => {
        this.loadingFollowing = false;
        this.moreResultsAvailableFollowing = false;
        this._utils.message(error, 'error');
      }
    })
  }

  moreResultsFollowing() {
    this.loadingFollowing = true;
    this._nextResultsFollowingSubscription = this._follow.nextFollowing().subscribe({
      next: (following) => {
        if (!following || !following.length) {
          this.moreResultsAvailableFollowing = false;
        }
        for (const f of following) {
          const tags = f.tags ? f.tags : [];
          for (const t of tags) {
            if (t.name === 'Wallet') {
              if (this._arweave.validateAddress(t.value)) {
                if (!this.following.has(t.value)) {
                  if (this.data.filterList.indexOf(t.value) >= 0) {
                    this.addAliasFollowing(true);
                  } else {
                    this.addAliasFollowing(false);
                  }
                }
                this.following.add(t.value);
              } else {
                console.error('Invalid Substory tag', t);
              }
            }
          }
        }
        this.loadingFollowing = false;
      },
      error: (error) => {
        this.loadingFollowing = false;
        this._utils.message(error, 'error');
      }
    })
  }

  onSubmit() {
    for (const following of this.aliasesFollowing.controls) {
      if (this._arweave.validateAddress(following.value)) {
        this.addressList.add(following.value);
      }
    }
    for (const follower of this.aliasesFollowers.controls) {
      if (this._arweave.validateAddress(follower.value)) {
        this.addressList.add(follower.value);
      }
    }
    this.close(Array.from(this.addressList));
  }

  followingChange(ev: MatCheckboxChange, i: number, s: string) {
    this.aliasesFollowing.controls[i].setValue('');
    if (ev.checked) {
      this.aliasesFollowing.controls[i].setValue(s);
    }
  }

  followersChange(ev: MatCheckboxChange, i: number, s: string) {
    this.aliasesFollowers.controls[i].setValue('');
    if (ev.checked) {
      this.aliasesFollowers.controls[i].setValue(s);
    }
  }

}
