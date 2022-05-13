import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { VertoService } from '../../core/services/verto.service';
import { UserInterface } from '@verto/js/dist/common/faces';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Subscription, tap, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { PostService } from '../../core/services/post.service';
import { UtilsService } from '../../core/utils/utils.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { NetworkInfoInterface } from 'arweave/web/network';
import { UserProfile } from '../../core/interfaces/user-profile';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  public post: TransactionMetadata|null = null;
  public loadingPost = false;
  private _postSubscription: Subscription = Subscription.EMPTY;
  public addressList: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private _verto: VertoService,
    private _arweave: ArweaveService,
    private _post: PostService,
    private _utils: UtilsService) { }

  ngOnInit(): void {
    this.route.data
      .subscribe(data => {
        const storyId = this.route.snapshot.paramMap.get('storyId')!;
        const profile: UserProfile = data['profile'];
        const userAddressList = profile.profile ?
          profile.profile.addresses :
          [profile.address];
        this.loadPost(userAddressList, storyId);
      });
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
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
        this._utils.message(error, 'error');
      }
    })
  }
}
