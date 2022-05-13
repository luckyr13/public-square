import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../core/services/user-auth.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  mainAddress = '';

  constructor(
    private _userAuth: UserAuthService
  ) { }

  ngOnInit(): void {
    this.mainAddress = this._userAuth.getMainAddressSnapshot();
    this._userAuth.account$.subscribe((address) => {
      this.mainAddress = address;
    });
  }

}
