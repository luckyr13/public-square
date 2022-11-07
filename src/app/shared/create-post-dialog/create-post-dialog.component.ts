import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';

@Component({
  selector: 'app-create-post-dialog',
  templateUrl: './create-post-dialog.component.html',
  styleUrls: ['./create-post-dialog.component.scss']
})
export class CreatePostDialogComponent implements OnInit {

  constructor(
    private _dialogRef: MatDialogRef<CreatePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      account: string,
    }) { }

  ngOnInit(): void {
  }


  newStoryCreated(tx: string) {
    const txMeta: TransactionMetadata = {
      id: tx,
      owner: this.data.account
    };
    this.close();
  }

  close() {
    this._dialogRef.close(null);
  }

}
