import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';
import { VouchDaoService } from '../../core/services/vouch-dao.service';

@Component({
  selector: 'app-arweave-address',
  templateUrl: './arweave-address.component.html',
  styleUrls: ['./arweave-address.component.scss']
})
export class ArweaveAddressComponent implements OnInit, OnDestroy {
  public vouched: boolean = false;
  @Input() address: string = '';
  @Input() isAddress: boolean = true;
  @Input() showOpenVieblockBtn: boolean = true;
  @Input() showCopyBtn: boolean = true;
  @Input() ellipsis: boolean = true;
  @Input() prependSymbol: string = '';
  @Input() showVouchedBtn: boolean = true;
  verificationSubscription = Subscription.EMPTY;
  vouchedSubscription = Subscription.EMPTY;

  constructor(
    private _clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private _utils: UtilsService,
    private _vouch: VouchDaoService) {}

  ngOnInit() {
    if (this.isAddress && this.address) {

      this.vouchedSubscription = this._vouch.isVouched(this.address).subscribe({
        next: (res) => {
          this.vouched = res;
        },
        error: (error) => {
          console.error('VouchDao: ', error);
        }
      });
    }
  }

  copyClipboard(content: string, msg: string = 'Content copied!', event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this._clipboard.copy(content);
    this._utils.message(msg, 'success');
  }

  ngOnDestroy() {
    this.verificationSubscription.unsubscribe();
  }
  
  applyEllipsis(s: string) {
    return this._utils.ellipsis(s);
  }


}
