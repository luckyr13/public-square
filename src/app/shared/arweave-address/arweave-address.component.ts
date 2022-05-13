import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ArverifyMapService } from '../../core/services/arverify-map.service'
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';

@Component({
  selector: 'app-arweave-address',
  templateUrl: './arweave-address.component.html',
  styleUrls: ['./arweave-address.component.scss']
})
export class ArweaveAddressComponent implements OnInit, OnDestroy {
  public verified: boolean = false;
  @Input() address: string = '';
  @Input() isAddress: boolean = true;
  @Input() showOpenVieblockBtn: boolean = true;
  @Input() showCopyBtn: boolean = true;
  @Input() showVerifiedBtn: boolean = true;
  @Input() ellipsis: boolean = true;
  @Input() prependSymbol: string = '';
  verificationSubscription = Subscription.EMPTY;

  constructor(
    private _arverifyMap: ArverifyMapService,
    private _clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private _utils: UtilsService) {}

  ngOnInit() {
    if (this.isAddress && this.address) {
      this.verificationSubscription = this._arverifyMap.getVerification(this.address).subscribe({
        next: (res) => {
          this.verified = res.verified;
        },
        error: (error) => {
          console.error('ArVerify: ', error);
        }
      })
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
