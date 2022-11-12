import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { Router, ActivatedRoute, ParamMap, Params, Data } from '@angular/router';
import { Subscription, tap, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { PostService } from '../../core/services/post.service';
import { UtilsService } from '../../core/utils/utils.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { NetworkInfoInterface } from 'arweave/web/network';
import { UserProfileAddress } from '../../core/interfaces/user-profile-address';
import { ReplyService } from '../../core/services/reply.service';
import { LikeService } from '../../core/services/like.service';
import { RepostService } from '../../core/services/repost.service';
import { ViewLikesDialogComponent } from '../../shared/view-likes-dialog/view-likes-dialog.component'; 
import { Direction } from '@angular/cdk/bidi';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewRepostsDialogComponent } from '../../shared/view-reposts-dialog/view-reposts-dialog.component'; 

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  public post: TransactionMetadata|null = null;
  public loadingPost = false;
  private _postSubscription: Subscription = Subscription.EMPTY;
  public addressList: string[] = [];
  public loadingReplies = false;
  public replies: TransactionMetadata[] = [];
  private _repliesSubscription: Subscription = Subscription.EMPTY;
  private _nextRepliesSubscription: Subscription = Subscription.EMPTY;
  private _maxReplies = 10;
  moreResultsAvailable = true;
  @ViewChild('moreResultsCard', { read: ElementRef }) moreResultsCard!: ElementRef;

  public loadingLikes = false;
  public loadingReposts = false;
  public likes: TransactionMetadata[] = [];
  private _likesSubscription: Subscription = Subscription.EMPTY;
  public maxLikes = 9;
  public maxLikesQuery = 20;
  public reposts: TransactionMetadata[] = [];
  private _repostsSubscription: Subscription = Subscription.EMPTY;
  public maxReposts = 9;
  public maxRepostsQuery = 20;

  constructor(
    private route: ActivatedRoute,
    private _arweave: ArweaveService,
    private _post: PostService,
    private _utils: UtilsService,
    private _reply: ReplyService,
    private _like: LikeService,
    private _userSettings: UserSettingsService,
    private _dialog: MatDialog,
    private _repost: RepostService) { }

  ngOnInit(): void {
    this.route.parent!.data
      .subscribe((data: Data) => {
        const storyId = this.route.snapshot.paramMap.get('storyId')!;
        const profile: UserProfileAddress = data['profile'];
        const userAddressList = profile.profile ?
          [profile.profile.address] :
          [profile.address];
        this.loadPost(userAddressList, storyId);
        this.loadReplies(storyId);
        this.loadLikes(storyId);
        this.loadReposts(storyId);
      });
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
    this._repliesSubscription.unsubscribe();
    this._nextRepliesSubscription.unsubscribe();
    this._likesSubscription.unsubscribe();
  }

  loadPost(from: string|string[], storyId: string) {
    this.loadingPost = true;
    this.post = null;
    const tmpFrom = typeof from === 'string' ? [from] : from;
    this._postSubscription = this._post.getPost(tmpFrom, storyId).subscribe({
      next: (post) => {
        this.post = post;
        this.loadingPost = false;
      },
      error: (error) => {
        this.loadingPost = false;
        // this._utils.message(error, 'error');
        console.error('postLoadPost', error);
      }
    })
  }

  loadReplies(storyId: string) {
    this.loadingReplies = true;
    this.replies = [];
    this._repliesSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._reply.getReplies(storyId, this._maxReplies, currentHeight)
      }),
    ).subscribe({
      next: (replies) => {
        this.replies = replies;
        this.loadingReplies = false;
      },
      error: (error) => {
        this.loadingReplies = false;
        this._utils.message(error, 'error');
      }
    })
  }

  moreReplies() {
    this.loadingReplies = true;
    this._nextRepliesSubscription = this._reply.next().subscribe({
      next: (replies) => {
        if (!replies || !replies.length) {
          this.moreResultsAvailable = false;
        } else {
          this.replies.push(...replies);
        }
        this.loadingReplies = false;
      },
      error: (error) => {
        this.loadingReplies = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    })
  }

  loadLikes(storyId: string) {
    this.loadingLikes = true;
    this.likes = [];
    this._repliesSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._like.getStoryLikes(storyId, this.maxLikesQuery, currentHeight)
      }),
    ).subscribe({
      next: (likes) => {
        for (const lk of likes) {
          if (!this.likes.find(v => v.id === lk.id)) {
            this.likes.push(lk);
          }
        }
        this.loadingLikes = false;
      },
      error: (error) => {
        this.loadingLikes = false;
        this._utils.message(error, 'error');
      }
    })
  }

  viewLikes() {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(
      ViewLikesDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: false,
        data: {
          postId: this.post ? this.post.id : 0
        },
        direction: direction
      });

    dialogRef.afterClosed().subscribe(() => { 
     
    });
  }

  loadReposts(storyId: string) {
    this.loadingReposts = true;
    this.reposts = [];
    this._repliesSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._repost.getStoryReposts(storyId, this.maxLikesQuery, currentHeight)
      }),
    ).subscribe({
      next: (reposts) => {
        for (const rp of reposts) {
          if (!this.reposts.find(v => v.id === rp.id)) {
            this.reposts.push(rp);
          }
        }
        this.loadingReposts = false;
      },
      error: (error) => {
        this.loadingReposts = false;
        this._utils.message(error, 'error');
      }
    })
  }

  viewReposts() {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(
      ViewRepostsDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: false,
        data: {
          postId: this.post ? this.post.id : 0
        },
        direction: direction
      });

    dialogRef.afterClosed().subscribe(() => { 
     
    });
  }


}
