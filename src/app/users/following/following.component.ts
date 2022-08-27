import { 
  Component, OnInit, OnDestroy, Input,
  ViewChild, ElementRef, NgZone } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Subscription, tap, Observable, of, from } from 'rxjs';
import { switchMap, map, concatMap } from 'rxjs/operators';
import { UtilsService } from '../../core/utils/utils.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { ProfileResolverService } from '../../core/route-guards/profile-resolver.service';
import { UserProfileAddress } from '../../core/interfaces/user-profile-address';
import { NetworkInfoInterface } from 'arweave/web/network';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { FollowService } from '../../core/services/follow.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit , OnDestroy {
  public following: {username: string, wallets: string[]}[] = [];
  private maxFollowers: number = 10;
  public loadingFollowing = false;
  private _followingSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  public moreResultsAvailable = true;
  public addressList: string[] = [];
  @ViewChild('moreResultsCard', { read: ElementRef }) moreResultsCard!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private _arweave: ArweaveService,
    private _follow: FollowService,
    private _utils: UtilsService,
    private _profileResolver: ProfileResolverService,
    private _appSettings: AppSettingsService,
    private _ngZone: NgZone) { }

  ngOnInit(): void {
    this.route.parent!.data
      .subscribe(data => {
        const profile: UserProfileAddress = data['profile'];
        const userAddressList = profile.profile && profile.profile.address ?
          [profile.profile.address] :
          [profile.address];
        const username = profile.profile ?
          profile.profile.username :
          '';
        this.loadFollowing(userAddressList);
      });

    this._appSettings.scrollTopStream.subscribe((scroll) => {
      this._ngZone.run(() => {
        const moreResultsPos = this.moreResultsCard.nativeElement.offsetTop -
          this.moreResultsCard.nativeElement.scrollTop;
        const padding = 700;
        if ((scroll > moreResultsPos - padding && moreResultsPos) && 
            !this.loadingFollowing &&
            this.moreResultsAvailable) {
          this.moreResults();
        }
      });
      
    })
  }

  ngOnDestroy() {
    this._followingSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
  }

  loadFollowing(from: string[]) {
    this.loadingFollowing = true;
    this.following = [];
    this._followingSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._follow.getFollowing(from, this.maxFollowers, currentHeight);
      }),
    ).subscribe({
      next: (followers) => {
        if (!followers || !followers.length) {
          this.moreResultsAvailable = false;
        }
        
        for (const f of followers) {
          this.extractTagsFromTx(f);
        }

        this.loadingFollowing = false;
      },
      error: (error) => {
        this.loadingFollowing = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    })
  }

  moreResults() {
    this.loadingFollowing = true;
    this._nextResultsSubscription = this._follow.nextFollowing().subscribe({
      next: (followers) => {
        if (!followers || !followers.length) {
          this.moreResultsAvailable = false;
        }
        for (const f of followers) {
          this.extractTagsFromTx(f);
        }
        this.loadingFollowing = false;
      },
      error: (error) => {
        this.loadingFollowing = false;
        this._utils.message(error, 'error');
      }
    })
  }


  extractTagsFromTx(tx: TransactionMetadata) {
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

    if (res.username || res.wallets.length) {
      this.following.push(res);
    }    
  }

}