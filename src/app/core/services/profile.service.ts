import { Injectable } from '@angular/core';
import { ArdbWrapper } from '../classes/ardb-wrapper';
import { ArweaveService } from './arweave.service';
import { TransactionMetadata } from '../interfaces/transaction-metadata';
import { UserAuthService } from './user-auth.service';
import { AppSettingsService } from './app-settings.service';
import { UtilsService } from '../utils/utils.service';
import { Observable, map, from } from 'rxjs';
import ArdbTransaction from 'ardb/lib/models/transaction';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _ardb: ArdbWrapper;

  constructor(
    private _arweave: ArweaveService,
    private _userAuth: UserAuthService,
    private _appSettings: AppSettingsService,
    private _utils: UtilsService) {
    this._ardb = new ArdbWrapper(this._arweave.arweave);
  }

  saveBannerImage(
    txImg: string,
    disableDispatch: boolean,
    extraTags: {name: string, value: string}[] = []) {
    const key = this._userAuth.getPrivateKey();
    const loginMethod = this._userAuth.loginMethod;
    const tags: {name: string, value: string}[] = [
      { name: 'App-Name', value: this._appSettings.protocolName },
      { name: 'Version', value: this._appSettings.protocolVersion },
      { name: 'Type', value: 'ProfileBannerImage' },
      { name: 'Img-Src-Id', value: txImg.trim() },
      ...extraTags
    ];
    
    if (txImg && !this._arweave.validateAddress(txImg)) {
      throw Error('Invalid target tx! ' + txImg)
    }
    const msg = 'ProfileBannerImage';
    return this._arweave.uploadFileToArweave(msg, 'text/plain', key, tags, loginMethod, disableDispatch);
  }

  getBannerImg(
    owners: string|string[],
    limit?: number,
    maxHeight?: number): Observable<TransactionMetadata[]> {
    const tags = [
      {
        name: "App-Name",
        values: [this._appSettings.protocolName]
      },
      {
        name: "Content-Type",
        values: ["text/plain"]
      },/*
      {
        name: "Version",
        values: [this._appSettings.protocolVersion]
      },*/
      {
        name: "Type",
        values: ["ProfileBannerImage"]
      },
    ];
    return this._ardb.searchTransactions(owners, limit, maxHeight, tags).pipe(
        map((_replies: ArdbTransaction[]) => {
          const res = _replies.map((tx) => {
            const reply: TransactionMetadata = {
              id: tx.id,
              owner: tx.owner.address,
              blockId: tx.block && tx.block.id ? tx.block.id : '',
              blockHeight: tx.block && tx.block.height ? tx.block.height : 0,
              dataSize: tx.data ? tx.data.size : undefined,
              dataType: tx.data ? tx.data.type : undefined,
              blockTimestamp: tx.block && tx.block.timestamp ? tx.block.timestamp : undefined,
              tags: tx.tags
            }
            return reply;
          });

          return res;
        })
      );
  }

  next(): Observable<TransactionMetadata[]> {
    return from(this._ardb.next()).pipe(
        map((_posts: ArdbTransaction[]) => {
          const res = _posts && _posts.length ? _posts.map((tx) => {
            const post: TransactionMetadata = {
              id: tx.id,
              owner: tx.owner.address,
              blockId: tx.block && tx.block.id ? tx.block.id : '',
              blockHeight: tx.block && tx.block.height ? tx.block.height : 0,
              dataSize: tx.data ? tx.data.size : undefined,
              dataType: tx.data ? tx.data.type : undefined,
              blockTimestamp: tx.block && tx.block.timestamp ? tx.block.timestamp : undefined,
              tags: tx.tags
            }
            return post;
          }) : [];
          return res;
        })
      );
  }

  
}