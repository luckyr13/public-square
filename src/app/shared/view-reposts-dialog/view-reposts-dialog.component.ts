import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UtilsService } from '../../core/utils/utils.service';
import { Subscription, switchMap } from 'rxjs';
import { RepostService } from '../../core/services/repost.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { ArweaveService } from '../../core/services/arweave.service';
import { NetworkInfoInterface } from 'arweave/web/network';

@Component({
  selector: 'app-view-reposts-dialog',
  templateUrl: './view-reposts-dialog.component.html',
  styleUrls: ['./view-reposts-dialog.component.scss']
})
export class ViewRepostsDialogComponent implements OnInit, OnDestroy {
  loadingReposts = false;
  private _repostsSubscription = Subscription.EMPTY;
  private _nextRepostsSubscription = Subscription.EMPTY;
  private _maxReposts = 10;
  public repostsList: TransactionMetadata[] = [];
  moreResultsAvailable = true;

  constructor(
    private _dialogRef: MatDialogRef<ViewRepostsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      postId: string
    },
    private _utils: UtilsService,
    private _repost: RepostService,
    private _arweave: ArweaveService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.loadingReposts = true;
    this.repostsList = [];
    const postId = this.data.postId;
    this._repostsSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._repost.getStoryReposts(postId, this._maxReposts, currentHeight)
      })
    ).subscribe({
      next: (reposts) => {
        if (!reposts || !reposts.length) {
          this.moreResultsAvailable = false;
        }
        this.repostsList.push(...reposts);
        this.loadingReposts = false;
      },
      error: (error) => {
        this.loadingReposts = false;
        this._utils.message(error, 'error');
      }
    })
  }

  close() {
    this._dialogRef.close();
  }

  ngOnDestroy() {
    this._repostsSubscription.unsubscribe();
    this._nextRepostsSubscription.unsubscribe();
  }

  timestampToDate(t: number|undefined|string) {
    t = t ? t : '';
    return this._utils.dateFormat(t);
  }

  moreResults() {
    this.loadingReposts = true;
    this._nextRepostsSubscription = this._repost.next().subscribe({
      next: (reposts) => {
        if (!reposts || !reposts.length) {
          this.moreResultsAvailable = false;
        }
        this.repostsList.push(...reposts);
        this.loadingReposts = false;
      },
      error: (error) => {
        this.loadingReposts = false;
        this._utils.message(error, 'error');
      }
    })
  }

}
