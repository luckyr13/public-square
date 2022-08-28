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
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit, OnDestroy {
  public followers: Set<string> = new Set([]);
  private maxFollowers: number = 10;
  public loadingFollowers = false;
  private _followersSubscription: Subscription = Subscription.EMPTY;
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
        this.loadFollowers(userAddressList);
      });

    this._appSettings.scrollTopStream.subscribe((scroll) => {
      this._ngZone.run(() => {
        const moreResultsPos = this.moreResultsCard.nativeElement.offsetTop -
          this.moreResultsCard.nativeElement.scrollTop;
        const padding = 700;
        if ((scroll > moreResultsPos - padding && moreResultsPos) && 
            !this.loadingFollowers &&
            this.moreResultsAvailable) {
          this.moreResults();
        }
      });
      
    })
  }

  ngOnDestroy() {
    this._followersSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
  }

  loadFollowers(wallets: string[]) {
    this.loadingFollowers = true;
    this.followers.clear();
    this._followersSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._follow.getFollowers(wallets, this.maxFollowers, currentHeight);
      }),
    ).subscribe({
      next: (followers) => {
        if (!followers || !followers.length) {
          this.moreResultsAvailable = false;
        }
        console.log(followers)
        for (const f of followers) {
          this.followers.add(f.owner);
        }
        this.loadingFollowers = false;
      },
      error: (error) => {
        this.loadingFollowers = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    })
  }

  moreResults() {
    this.loadingFollowers = true;
    this._nextResultsSubscription = this._follow.next().subscribe({
      next: (followers) => {
        if (!followers || !followers.length) {
          this.moreResultsAvailable = false;
        }
        for (const f of followers) {
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

}
