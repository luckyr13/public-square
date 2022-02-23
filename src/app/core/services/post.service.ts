import { Injectable } from '@angular/core';
import ArdbTransaction from 'ardb/lib/models/transaction';
import { Observable, from, map } from 'rxjs';
import { ArdbWrapper } from '../classes/ardb-wrapper';
import { ArweaveService } from './arweave.service';
import { Post } from '../interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private _ardb: ArdbWrapper;

  constructor(private _arweave: ArweaveService) {
    this._ardb = new ArdbWrapper(this._arweave.arweave);
  }

  getLatestPosts(from: string[] | string = [], limit?: number, maxHeight?: number): Observable<Post[]> {
  	const tags = [
  		{
        name: "App-Name",
        values: ["PublicSquare"]
      },
      {
        name: "Content-Type",
        values: ["text/plain"]
      },
      {
        name: "Version",
        values: ["1", "2"]
      },
      {
        name: "Type",
        values: ["post"]
      },
  	];
  	return this._ardb.searchTransactions(from, limit, maxHeight, tags).pipe(
        map((_posts: ArdbTransaction[]) => {
          console.log(_posts)
          const res = _posts.map((tx) => {
            const post: Post = {
              id: tx.id,
              author: tx.owner.address,
              blockId: tx.block.id,
              blockHeight: tx.block.height,
              dataSize: tx.data.size,
              dataType: tx.data.type,
            }
            return post;
          });

          return res;
        })
      );
  }

  next(): Observable<ArdbTransaction[]> {

    return from(this._ardb.next());

  }


}
