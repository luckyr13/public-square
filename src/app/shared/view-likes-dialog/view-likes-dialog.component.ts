import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UtilsService } from '../../core/utils/utils.service';
import { Subscription, switchMap } from 'rxjs';
import { LikeService } from '../../core/services/like.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { ArweaveService } from '../../core/services/arweave.service';
import { NetworkInfoInterface } from 'arweave/web/network';

@Component({
  selector: 'app-view-likes-dialog',
  templateUrl: './view-likes-dialog.component.html',
  styleUrls: ['./view-likes-dialog.component.scss']
})
export class ViewLikesDialogComponent implements OnInit, OnDestroy {
  loadingLikes = false;
  private _likesSubscription = Subscription.EMPTY;
  private _nextLikesSubscription = Subscription.EMPTY;
  private _maxLikes = 10;
  public likesList: TransactionMetadata[] = [];
  moreResultsAvailable = true;

  constructor(
    private _dialogRef: MatDialogRef<ViewLikesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      postId: string
    },
    private _utils: UtilsService,
    private _like: LikeService,
    private _arweave: ArweaveService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.loadingLikes = true;
    this.likesList = [];
    const postId = this.data.postId;
    this._likesSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._like.getStoryLikes(postId, this._maxLikes, currentHeight)
      })
    ).subscribe({
      next: (likes) => {
        if (!likes || !likes.length) {
          this.moreResultsAvailable = false;
        }
        this.likesList.push(...likes);
        this.loadingLikes = false;
      },
      error: (error) => {
        this.loadingLikes = false;
        this._utils.message(error, 'error');
      }
    })
  }

  close() {
    this._dialogRef.close();
  }

  ngOnDestroy() {
    this._likesSubscription.unsubscribe();
    this._nextLikesSubscription.unsubscribe();
  }

  timestampToDate(t: number|undefined|string) {
    t = t ? t : '';
    return this._utils.dateFormat(t);
  }

  moreResults() {
    this.loadingLikes = true;
    this._nextLikesSubscription = this._like.next().subscribe({
      next: (likes) => {
        if (!likes || !likes.length) {
          this.moreResultsAvailable = false;
        }
        this.likesList.push(...likes);
        this.loadingLikes = false;
      },
      error: (error) => {
        this.loadingLikes = false;
        this._utils.message(error, 'error');
      }
    })
  }

}
