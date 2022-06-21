import { Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { Router, ActivatedRoute, ParamMap, Params, Data } from '@angular/router';
import { Subscription, tap, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UtilsService } from '../../core/utils/utils.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { NetworkInfoInterface } from 'arweave/web/network';
import { LikeService } from '../../core/services/like.service';
import { UserProfile } from '../../core/interfaces/user-profile';
import { AppSettingsService } from '../../core/services/app-settings.service';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss']
})
export class LikesComponent implements OnInit, OnDestroy {
  public loadingLikes = false;
  public likes: TransactionMetadata[] = [];
  private _likesSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  private _maxLikes = 10;
  moreResultsAvailable = true;
  @ViewChild('moreResultsCard', { read: ElementRef }) moreResultsCard!: ElementRef;
  public mainUsername = '';

  constructor(
    private route: ActivatedRoute,
    private _arweave: ArweaveService,
    private _utils: UtilsService,
    private _like: LikeService,
    private _appSettings: AppSettingsService,
    private _ngZone: NgZone) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: Data) => {
        const storyId = this.route.snapshot.paramMap.get('storyId')!;
        const profile: UserProfile = data['profile'];
        const userAddressList = profile.profile && profile.profile.addresses ?
          profile.profile.addresses :
          [profile.address];
        this.mainUsername = profile.profile && profile.profile.username ?
          profile.profile.username : profile.address;
        this.loadLikes(userAddressList);
      });

    this._appSettings.scrollTopStream.subscribe((scroll) => {
      this._ngZone.run(() => {
        const moreResultsPos = this.moreResultsCard.nativeElement.offsetTop -
          this.moreResultsCard.nativeElement.scrollTop;
        const padding = 700;
        if ((scroll > moreResultsPos - padding && moreResultsPos) && 
            !this.loadingLikes &&
            this.moreResultsAvailable) {
          this.moreResults();
        }
      });
      
    })
  }

  ngOnDestroy() {
    this._likesSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
  }

  loadLikes(from: string[]) {
    this.loadingLikes = true;
    this.likes = [];
    this._likesSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._like.getLikesFromUser(from, this._maxLikes, currentHeight)
      })
    ).subscribe({
      next: (likes) => {
        if (!likes || !likes.length) {
          this.moreResultsAvailable = false;
        }
        this.likes.push(...likes);
        this.loadingLikes = false;
      },
      error: (error) => {
        this.loadingLikes = false;
        this._utils.message(error, 'error');
      }
    })
  }

  moreResults() {
    this.loadingLikes = true;
    this._nextResultsSubscription = this._like.nextLikesFromUser().subscribe({
      next: (likes) => {
        if (!likes || !likes.length) {
          this.moreResultsAvailable = false;
        }
        this.likes.push(...likes);
        this.loadingLikes = false;
      },
      error: (error) => {
        this.loadingLikes = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    })
  }

  extractTagFromTx(tx: TransactionMetadata, tag: string) {
    const tags = tx.tags ? tx.tags : [];
    for (const t of tags) {
      if (t.name === tag) {
        return t.value;
      }
    }
    return null;
  }

}
