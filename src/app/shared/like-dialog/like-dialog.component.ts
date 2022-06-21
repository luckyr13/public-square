import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { from, Observable, Subscription, concatMap, of } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';
import { LikeService } from '../../core/services/like.service';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { ArweaveService } from '../../core/services/arweave.service';

@Component({
  selector: 'app-like-dialog',
  templateUrl: './like-dialog.component.html',
  styleUrls: ['./like-dialog.component.scss']
})
export class LikeDialogComponent implements OnInit, OnDestroy {
  useDispatch = new UntypedFormControl(false);
  loadingLike = false;
  private _likeSubscription = Subscription.EMPTY;
  likeTxId: string = '';

  constructor(
    private _dialogRef: MatDialogRef<LikeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      postOwner: string,
      txId: string,
      myAddress: string,
      postOwnerUsername: string,
      postOwnerImage: string,
      postContent: string,
      contentType: string
    },
    private _utils: UtilsService,
    private _like: LikeService,
    private _appSettings: AppSettingsService,
    private _arweave: ArweaveService) { }


  ngOnInit(): void {
  }

  close(msg: string = '') {
    this._dialogRef.close(msg);
  }

  submit() {
    const disableDispatch = !this.useDispatch.value;
    this.loadingLike = true;
    this._likeSubscription = this._like.like(
      this.data.txId,
      disableDispatch
    ).subscribe({
      next: (tx) => {
        this.loadingLike = false;
        this.likeTxId = tx.id;
      },
      error: (error) => {
        this.loadingLike = false
        console.error('Error!', error);
        this._utils.message('Error!', 'error');
      }
    });
  }

  ngOnDestroy() {
    this._likeSubscription.unsubscribe();
  }

  validateContentType(contentType: string, desiredType: 'image'|'audio'|'video'|'text') {
    return (
      Object.prototype.hasOwnProperty.call(this._appSettings.supportedFiles, desiredType) ?
      this._appSettings.supportedFiles[desiredType].indexOf(contentType) >= 0 :
      false
    );
  }

  getFullImgUrlFromTx(tx: string) {
    return `${this._arweave.baseURL}${tx}`;
  }

  openLink(event: MouseEvent, txId: string) {
    event.stopPropagation();
    const url = `${this._arweave.baseURL}${txId}`;
    window.open(url, '_blank');
  }

}
