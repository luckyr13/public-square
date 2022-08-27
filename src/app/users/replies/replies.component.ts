import { Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { Router, ActivatedRoute, ParamMap, Params, Data } from '@angular/router';
import { Subscription, tap, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UtilsService } from '../../core/utils/utils.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { NetworkInfoInterface } from 'arweave/web/network';
import { ReplyService } from '../../core/services/reply.service';
import { UserProfileAddress } from '../../core/interfaces/user-profile-address';
import { AppSettingsService } from '../../core/services/app-settings.service';

@Component({
  selector: 'app-replies',
  templateUrl: './replies.component.html',
  styleUrls: ['./replies.component.scss']
})
export class RepliesComponent implements OnInit, OnDestroy {
  public loadingReplies = false;
  public replies: TransactionMetadata[] = [];
  private _repliesSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  private _maxReplies = 10;
  moreResultsAvailable = true;
  @ViewChild('moreResultsCard', { read: ElementRef }) moreResultsCard!: ElementRef;
  public mainUsername = '';

  constructor(
    private route: ActivatedRoute,
    private _arweave: ArweaveService,
    private _utils: UtilsService,
    private _reply: ReplyService,
    private _appSettings: AppSettingsService,
    private _ngZone: NgZone) { }

  ngOnInit(): void {
    this.route.parent!.data
      .subscribe((data: Data) => {
        const storyId = this.route.snapshot.paramMap.get('storyId')!;
        const profile: UserProfileAddress = data['profile'];
        const userAddressList = profile.profile && profile.profile.address ?
          [profile.profile.address] :
          [profile.address];
        this.mainUsername = profile.profile && profile.profile.username ?
          profile.profile.username : profile.address;
        this.loadReplies(userAddressList);
      });

    this._appSettings.scrollTopStream.subscribe((scroll) => {
      this._ngZone.run(() => {
        const moreResultsPos = this.moreResultsCard.nativeElement.offsetTop -
          this.moreResultsCard.nativeElement.scrollTop;
        const padding = 700;
        if ((scroll > moreResultsPos - padding && moreResultsPos) && 
            !this.loadingReplies &&
            this.moreResultsAvailable) {
          this.moreResults();
        }
      });
      
    })
  }

  ngOnDestroy() {
    this._repliesSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
  }

  loadReplies(from: string[]) {
    this.loadingReplies = true;
    this.replies = [];
    this._repliesSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._reply.getRepliesFromUser(from, this._maxReplies, currentHeight)
      })
    ).subscribe({
      next: (replies) => {
        if (!replies || !replies.length) {
          this.moreResultsAvailable = false;
        }
        this.replies.push(...replies);
        this.loadingReplies = false;
      },
      error: (error) => {
        this.loadingReplies = false;
        this._utils.message(error, 'error');
      }
    })
  }

  moreResults() {
    this.loadingReplies = true;
    this._nextResultsSubscription = this._reply.nextRepliesFromUser().subscribe({
      next: (replies) => {
        if (!replies || !replies.length) {
          this.moreResultsAvailable = false;
        }
        this.replies.push(...replies);
        this.loadingReplies = false;
      },
      error: (error) => {
        this.loadingReplies = false;
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
