import { Component, OnInit, Inject, OnDestroy} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ArweaveService } from '../../core/services/arweave.service';
import { UtilsService } from '../../core/utils/utils.service';
import { UserAuthService } from '../../core/services/user-auth.service';

@Component({
  selector: 'app-donate-dialog',
  templateUrl: './donate-dialog.component.html',
  styleUrls: ['./donate-dialog.component.scss']
})
export class DonateDialogComponent implements OnInit , OnDestroy {
  amount: number = 0;
  maxAmount: number = 0;
  balance: number = 0;
  _balanceSubscription: Subscription = Subscription.EMPTY;
  _donationSubscription: Subscription = Subscription.EMPTY;
  loadingBalance: boolean = false;
  loadingDonationInProgress: boolean = false;
  txDonation: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {mainAddress: string, to: string},
    private _dialogRef: MatDialogRef<DonateDialogComponent>,
    private _arweave: ArweaveService,
    private _auth: UserAuthService,
    private _utils: UtilsService) { }

  ngOnInit(): void {
    
    this.getBalance();
  }

  getBalance() {
    this.loadingBalance = true;
    this.balance = 0;
    this.maxAmount = 0;

    this._balanceSubscription = this._arweave
      .getAccountBalance(this.data.mainAddress)
      .subscribe({
        next: (res: string) => {
          this.balance = +res;
          this.loadingBalance = false;
          if (this.balance >= 10) {
            this.maxAmount = 10;
          } else if (this.balance > 0) {
            this.maxAmount = this.balance;
          }
        },
        error: (error: any) => {
          this.loadingBalance = false;
        }
      });
  }

  ngOnDestroy() {
    this._balanceSubscription.unsubscribe();
    this._donationSubscription.unsubscribe();
  }

  sendDonation(amount: number, to: string) {
    this.loadingDonationInProgress = true;
    this.txDonation = '';
    const pk = this._auth.getPrivateKey();

    this._donationSubscription = this._arweave.sendDonation(to, `${amount}`, pk).subscribe({
      next: (tx) => {
        this.txDonation = tx.id;
        this.loadingDonationInProgress = false;
      },
      error: (error) => {
        this._utils.message(error, 'error');
        this.loadingDonationInProgress = false;
      }
    });
    
  }

  close(success: boolean = false) {
    this._dialogRef.close(success);
  }
}