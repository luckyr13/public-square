import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { from, Observable, Subscription, concatMap, of } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';
import { FollowService } from '../../core/services/follow.service';

@Component({
  selector: 'app-follow-dialog',
  templateUrl: './follow-dialog.component.html',
  styleUrls: ['./follow-dialog.component.scss']
})
export class FollowDialogComponent implements OnInit, OnDestroy {
  useDispatch = new UntypedFormControl(false);
  loadingFollow = false;
  followSubscription = Subscription.EMPTY;
  followTxId: string = '';

  constructor(
    private _dialogRef: MatDialogRef<FollowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      username: string,
      wallets: string[]
    },
    private _utils: UtilsService,
    private _follow: FollowService) { }


  ngOnInit(): void {
  }

  close(success: boolean = false) {
    this._dialogRef.close(success);
  }

  submit() {
    const disableDispatch = !this.useDispatch.value;
    this.loadingFollow = true;
    this.followSubscription = this._follow.follow(
      this.data.username,
      this.data.wallets,
      disableDispatch
    ).subscribe({
      next: (tx) => {
        this.loadingFollow = false;
        this.followTxId = tx.id;
      },
      error: (error) => {
        this.loadingFollow = false
        console.error('Error!', error);
        this._utils.message('Error!', 'error');
      }
    });
       
  }


  ngOnDestroy() {
    this.followSubscription.unsubscribe();
  }

}
