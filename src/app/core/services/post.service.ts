import { Injectable } from '@angular/core';
import ArdbTransaction from 'ardb/lib/models/transaction';
import { Observable, from, map } from 'rxjs';
import { ArdbWrapper } from '../classes/ardb-wrapper';
import { ArweaveService } from './arweave.service';
import { TransactionMetadata } from '../interfaces/transaction-metadata';
import { UserAuthService } from './user-auth.service';
import { AppSettingsService } from './app-settings.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private _ardb: ArdbWrapper;
  private _ardbSingle: ArdbWrapper;

  constructor(
    private _arweave: ArweaveService,
    private _userAuth: UserAuthService,
    private _appSettings: AppSettingsService,
    private _utils: UtilsService) {
    this._ardb = new ArdbWrapper(this._arweave.arweave);
    this._ardbSingle = new ArdbWrapper(this._arweave.arweave);
  }

  createPost(
    msg: string,
    disableDispatch: boolean,
    extraTags: {name: string, value: string}[] = [],
    isSubstory: boolean = false,
    type: 'text'|'image'|'video') {
    const key = this._userAuth.getPrivateKey();
    const loginMethod = this._userAuth.loginMethod;
    const tags: {name: string, value: string}[] = [
      { name: 'App-Name', value: this._appSettings.protocolName },
      { name: 'Version', value: this._appSettings.protocolVersion },
      { name: 'Type', value: 'post' },
      ...extraTags
    ];

    if (type === 'text') {    
      // Detect hashtags and mentions
      const hashtags = this._utils.getLinkHashtags(msg);
      for (const ht of hashtags) {
        tags.push({ name: 'Hashtag', value: ht.value.toLowerCase() });
      }
      const mentions = this._utils.getLinkMentions(msg);
      for (const mn of mentions) {
        tags.push({ name: 'Mention', value: mn.value });
      }
    }

    return this._arweave.uploadFileToArweave(msg, 'text/plain', key, tags, loginMethod, disableDispatch);
  }

  getLatestPosts(from: string[] | string = [], limit?: number, maxHeight?: number): Observable<TransactionMetadata[]> {
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
        name: "Type",
        values: ["post"]
      },
      /*
      // Koii filter
      {
        name: "Network",
        values: ["Koii"]
      },
      */
    ];
    return this._ardb.searchTransactions(from, limit, maxHeight, tags).pipe(
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
              tags: tx.tags
            }
            return post;
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

  getPost(from: string[] | string = [], postId: string): Observable<TransactionMetadata> {
    return this._ardb.searchOneTransaction(from, postId).pipe(
        map((tx: ArdbTransaction) => {
          if (!tx) {
            throw new Error('Tx not found!');
          }
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
        })
      );
  }

  createSignedTXPost(msg: string) {
    const key = this._userAuth.getPrivateKey();
    const loginMethod = this._userAuth.loginMethod;
    const tags: {name: string, value: string}[] = [
      { name: 'App-Name', value: this._appSettings.protocolName },
      { name: 'Version', value: this._appSettings.protocolVersion },
      { name: 'Type', value: 'post' }
    ];
    return this._arweave.generateSignedTx(msg, 'text/plain', key, tags);
  }

  getPostById(postId: string): Observable<TransactionMetadata> {
    return this._ardbSingle.searchOneTransactionById(postId).pipe(
        map((tx: ArdbTransaction) => {
          if (!tx) {
            throw new Error('Tx not found!');
          }
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
        })
      );
  }

}
