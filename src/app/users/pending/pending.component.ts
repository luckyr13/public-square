import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Subscription, tap, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { PendingPostsService } from '../../core/services/pending-posts.service';
import { UtilsService } from '../../core/utils/utils.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { ProfileResolverService } from '../../core/route-guards/profile-resolver.service';
import { UserProfileAddress } from '../../core/interfaces/user-profile-address';
import { NetworkInfoInterface } from 'arweave/web/network';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit, OnDestroy {
  public posts: TransactionMetadata[] = [];
  private maxPosts: number = 10;
  public loadingPosts = false;
  private _postSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  public moreResultsAvailable = true;
  public addressList: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private _arweave: ArweaveService,
    private _post: PendingPostsService,
    private _utils: UtilsService,
    private _profileResolver: ProfileResolverService) { }

  ngOnInit(): void {
    this.route.parent!.data
      .subscribe(data => {
        const profile: UserProfileAddress = data['profile'];
        const userAddressList = profile.profile && profile.profile.address ?
          [profile.profile.address] :
          [profile.address];
        this.loadPosts(userAddressList);
      });
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
  }

  loadPosts(from: string|string[]) {
    this.loadingPosts = true;
    this.posts = [];
    this._postSubscription = this._post.getPendingPosts(from).subscribe({
      next: (posts) => {
        if (!posts || !posts.length) {
          this.moreResultsAvailable = false;
        }
        this.posts = posts;
        this.loadingPosts = false;
      },
      error: (error) => {
        this.loadingPosts = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    })
  }

  moreResults() {
    this.loadingPosts = true;
    console.log('next!')
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
        this._utils.message(error, 'error');
      }
    })
  }

}
