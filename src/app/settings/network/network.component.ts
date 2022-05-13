import { Component, OnInit } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { Subscription } from 'rxjs';
import { NetworkInfoInterface } from 'arweave/web/network';
import { UtilsService } from '../../core/utils/utils.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  host = '';
  protocol = '';
  port = 0;
  baseURL = '';
  networkInfo: NetworkInfoInterface|null = null;
  networkInfoSubscription = Subscription.EMPTY;
  loadingNetworkInfo = false;

  constructor(
    private _arweave: ArweaveService,
    private _utils: UtilsService
  ) {
    this.host = this._arweave.host;
    this.protocol = this._arweave.protocol;
    this.port = this._arweave.port;
    this.baseURL = this._arweave.baseURL;
    
  }

  ngOnInit(): void {
    this.loadingNetworkInfo = true;
    this.networkInfoSubscription = this._arweave.getNetworkInfo().subscribe({
      next: (info: NetworkInfoInterface) => {
        this.networkInfo = info;
        this.loadingNetworkInfo = false;
      },
      error: (error: string) => {
        this.loadingNetworkInfo = false;
        this._utils.message(error, 'error');
      }
    });

  }

}
