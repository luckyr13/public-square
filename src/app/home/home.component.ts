import { 
  Component, OnInit, OnDestroy,
  ViewChild, ElementRef, NgZone } from '@angular/core';
import { PostService } from '../core/services/post.service';
import { Subscription, of, map } from 'rxjs';
import { switchMap, mergeMap, tap } from 'rxjs/operators';
import { TransactionMetadata } from '../core/interfaces/transaction-metadata';
import { UserAuthService } from '../core/services/user-auth.service';
import { AppSettingsService } from '../core/services/app-settings.service';
import { UtilsService } from '../core/utils/utils.service';
import { ArweaveService } from '../core/services/arweave.service';
import { NetworkInfoInterface } from 'arweave/web/network';
import { PendingPostsService } from '../core/services/pending-posts.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private _postSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  private _pendingPostsSubscription: Subscription = Subscription.EMPTY;
  public posts: TransactionMetadata[] = [];
  private maxPosts: number = 10;
  public loadingPosts = false;
  account: string = '';
  version: string = '';
  moreResultsAvailable = true;
  @ViewChild('moreResultsCard', { read: ElementRef }) moreResultsCard!: ElementRef;

  constructor(
    private _post: PostService,
    private _pendingPosts: PendingPostsService,
    private _auth: UserAuthService,
    private _appSettings: AppSettingsService,
    private _utils: UtilsService,
    private _arweave: ArweaveService,
    private _ngZone: NgZone) {
    this.version = this._appSettings.appVersion;
  }

  ngOnInit(): void {
    this.loadingPosts = true;
    this.account = this._auth.getMainAddressSnapshot();

    this._auth.account$.subscribe((account) => {
      this.account = account;

      this._pendingPostsSubscription = this._pendingPosts.getPendingPosts(
        [this.account], undefined, undefined
      ).subscribe((pendingPosts) => {
        const res = Array.isArray(pendingPosts) && pendingPosts.length ? 
          pendingPosts.filter((v) => {
            for (const p of this.posts) {
              if (p.id == v.id) {
                return false;
              }
            }
            return true;
          }) : [];
        this.posts.unshift(...res);
      })
    });

    this._postSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._post.getLatestPosts([], this.maxPosts, currentHeight);
      }),
      mergeMap((latestPosts) => {
        if (!this.account) {
          return of(latestPosts);
        }
        return this._pendingPosts.getPendingPosts(
          [this.account], undefined, undefined
        ).pipe(
          map((pendingPosts) => {
            const res = pendingPosts.filter((v) => {
              for (const p of this.posts) {
                if (p.id == v.id) {
                  return false;
                }
              }
              return true;
            });
            return res.concat(latestPosts);
          })
        );
      })
    ).subscribe({
      next: (posts) => {
        if (!posts || !posts.length) {
          this.moreResultsAvailable = false;
        }
        this.posts.push(...posts);
        this.loadingPosts = false;
      },
      error: (error) => {
        this.loadingPosts = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    });

    this._auth.account$.subscribe((_account) => {
      this.account = _account;
    });


    this._appSettings.scrollTopStream.subscribe((scroll) => {
      this._ngZone.run(() => {
        const moreResultsPos = this.moreResultsCard.nativeElement.offsetTop -
          this.moreResultsCard.nativeElement.scrollTop;
        const padding = 700;
        if ((scroll > moreResultsPos - padding) && 
            !this.loadingPosts &&
            this.moreResultsAvailable) {
          this.moreResults();
        }
      });
      
    })



    
  }

  moreResults() {
    this.loadingPosts = true;
    this._nextResultsSubscription = this._post.next().subscribe({
      next: (posts) => {
        if (!posts || !posts.length) {
          this.moreResultsAvailable = false;
        }
        this.posts = this.posts.concat(posts);
        this.loadingPosts = false;
      },
      error: (error) => {
        this.loadingPosts = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    })
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
    this._pendingPostsSubscription.unsubscribe();
  }

  newStoryCreated(tx: string) {
    const txMeta: TransactionMetadata = {
      id: tx,
      owner: this.account
    };
    this.posts.unshift(txMeta);
  }

}
