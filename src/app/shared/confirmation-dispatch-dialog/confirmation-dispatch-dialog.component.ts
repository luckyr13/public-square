import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { from, Observable, Subscription, concatMap, of } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';
import { ArweaveService } from '../../core/services/arweave.service';

@Component({
  selector: 'app-confirmation-dispatch-dialog',
  templateUrl: './confirmation-dispatch-dialog.component.html',
  styleUrls: ['./confirmation-dispatch-dialog.component.scss']
})
export class ConfirmationDispatchDialogComponent  implements OnInit {
  useDispatch = new UntypedFormControl(false);
  loadingConfirmation = false;
  dispatchAvailable = false;

  constructor(
    private _dialogRef: MatDialogRef<ConfirmationDispatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      address: string,
      msg: string,
      dataSize: number
    },
    private _utils: UtilsService,
    private _arweave: ArweaveService) { }


  ngOnInit(): void {
    if (this.data.dataSize <= this._arweave.dataSizeLimitDispatch) {
      this.dispatchAvailable = true;
    }
  }

  close(success: boolean = false, useDispatch: boolean = false) {
    this._dialogRef.close({success: success, useDispatch: useDispatch});
  }


}
