import { Injectable } from '@angular/core';
import { ArweaveService } from './arweave.service';
import { 
  Warp, Contract, WarpWebFactory } from 'warp-contracts';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WarpContractsService {

  public readonly gatewayUrl = `https://gateway.redstone.finance`;

  constructor(private _arweave: ArweaveService) {
    

  }


}
