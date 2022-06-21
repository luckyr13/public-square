import { Injectable } from '@angular/core';
import ArdbTransaction from 'ardb/lib/models/transaction';
import { Observable, from, map } from 'rxjs';
import { ArdbWrapper } from '../classes/ardb-wrapper';
import { ArweaveService } from './arweave.service';
import { TransactionMetadata } from '../interfaces/transaction-metadata';
import { UserAuthService } from './user-auth.service';
import { AppSettingsService } from './app-settings.service';
import { UtilsService } from '../utils/utils.service';
import { fieldType } from 'ardb/lib/faces/fields';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private _ardb1: ArdbWrapper;
  private _ardb2: ArdbWrapper;

  constructor(
    private _arweave: ArweaveService,
    private _userAuth: UserAuthService,
    private _appSettings: AppSettingsService,
    private _utils: UtilsService) {
    this._ardb1 = new ArdbWrapper(this._arweave.arweave);
    this._ardb2 = new ArdbWrapper(this._arweave.arweave);
  }

  follow(
    username: string,
    wallets: string[],
    disableDispatch: boolean,
    extraTags: {name: string, value: string}[] = []) {
    const key = this._userAuth.getPrivateKey();
    const loginMethod = this._userAuth.loginMethod;
    const tags: {name: string, value: string}[] = [
      { name: 'App-Name', value: this._appSettings.protocolName },
      { name: 'Version', value: this._appSettings.protocolVersion },
      { name: 'Type', value: 'Follow' },
      { name: 'Username', value: username.trim() },
      ...extraTags
    ];
    const numWallets = wallets.length;
    if (numWallets <= 0) {
      throw new Error('You need to follow at least one address!')
    }
    for (let i = 0; i < numWallets; i++) {
      tags.push({
        name: 'Wallet',
        value: wallets[i]
      });
    }
    const msg = 'follow';
    return this._arweave.uploadFileToArweave(msg, 'text/plain', key, tags, loginMethod, disableDispatch);
  }

  getFollowers(
    username: string,
    wallets: string[] | string = [],
    limit?: number,
    maxHeight?: number): Observable<TransactionMetadata[]> {
    const users: string[] = [''];
    if (username.trim()) {
      users.push(username.trim());
    }
    const tags = [
      {
        name: "App-Name",
        values: [this._appSettings.protocolName]
      },
      {
        name: "Content-Type",
        values: ["text/plain"]
      },
      {
        name: "Version",
        values: [this._appSettings.protocolVersion]
      },
      {
        name: "Type",
        values: ["Follow"]
      },
      {
        name: "Username",
        values: users
      },
      {
        name: "Wallet",
        values: wallets
      }
    ];
    const fields: fieldType[] = ['id', 'owner'];
    return this._ardb1.searchTransactions([], limit, maxHeight, tags, fields).pipe(
        map((_posts: ArdbTransaction[]) => {
          const res = _posts.map((tx) => {
            const post: TransactionMetadata = {
              id: tx.id,
              owner: tx.owner.address,
              blockId: tx.block && tx.block.id ? tx.block.id : '',
              blockHeight: tx.block && tx.block.height ? tx.block.height : 0,
              dataSize: tx.data ? tx.data.size : undefined,
              dataType: tx.data ? tx.data.type : undefined,
              blockTimestamp: tx.block && tx.block.timestamp ? tx.block.timestamp : undefined
            }
            return post;
          });

          return res;
        })
      );
  }

  next(): Observable<TransactionMetadata[]> {
    return from(this._ardb1.next()).pipe(
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
              tags: tx.tags ? tx.tags : undefined
            }
            return post;
          }) : [];
          return res;
        })
      );
  }

  getFollowing(
    from: string[] | string = [],
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
      },
      {
        name: "Version",
        values: [this._appSettings.protocolVersion]
      },
      {
        name: "Type",
        values: ["Follow"]
      }
    ];
    const fields: fieldType[] = ['id', 'owner', 'tags'];
    return this._ardb2.searchTransactions(from, limit, maxHeight, tags, fields).pipe(
        map((_posts: ArdbTransaction[]) => {
          const res = _posts.map((tx) => {
            const post: TransactionMetadata = {
              id: tx.id,
              owner: tx.owner.address,
              blockId: tx.block && tx.block.id ? tx.block.id : '',
              blockHeight: tx.block && tx.block.height ? tx.block.height : 0,
              dataSize: tx.data ? tx.data.size : undefined,
              dataType: tx.data ? tx.data.type : undefined,
              blockTimestamp: tx.block && tx.block.timestamp ? tx.block.timestamp : undefined,
              tags: tx.tags ? tx.tags : undefined
            }
            return post;
          });

          return res;
        })
      );
  }

  nextFollowing(): Observable<TransactionMetadata[]> {
    return from(this._ardb2.next()).pipe(
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
              tags: tx.tags ? tx.tags : undefined
            }
            return post;
          }) : [];
          return res;
        })
      );
  }

}
