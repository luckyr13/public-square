import { Injectable } from '@angular/core';
import { Observable, throwError, from, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Arweave from 'arweave';
import { NetworkInfoInterface } from 'arweave/web/network';
import { TransactionStatusResponse } from 'arweave/web/transactions';
import Transaction from 'arweave/web/lib/transaction';
import { ArweaveWebWallet } from 'arweave-wallet-connector';
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class ArweaveService {
  public readonly arweave: Arweave;
  public readonly baseURL: string = 'https://arweave.net/';
  public readonly blockToSeconds: number = 0.5 / 60;
  public readonly arweaveWebWallet: ArweaveWebWallet;

  constructor() {
    this.arweave = Arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
    });

    this.arweaveWebWallet = new ArweaveWebWallet({
      name: 'Public Square',
      logo: 'https://arweave.net/wJGdli6nMQKCyCdtCewn84ba9-WsJ80-GS-KtKdkCLg'
    })
    this.arweaveWebWallet.setUrl('arweave.app');
  }

  /*
  * @dev Get Arweave network info
  */
  getNetworkInfo(): Observable<NetworkInfoInterface> {
    return from(this.arweave.network.getInfo()).pipe(
      catchError(this.errorHandler)
    );
  }

  /*
  * @dev Get networks' name
  */
  getNetworkName(): Observable<string> {
    return this.getNetworkInfo().pipe(
      map((res: NetworkInfoInterface) => {
        return res.network;
      }),
      catchError(this.errorHandler)
    );
  }

  /*
  *  @dev Get address from wallet
  */
  getAccount(method: string): Observable<string> {
    const obs = new Observable<string>((subscriber) => {
      if (method === 'arconnect' || method === 'finnie') {
        if (!(window && window.arweaveWallet)) {
          subscriber.error('Login method not available!');
        }
        // Get main account
        // very similar to window.ethereum.enable
        this.arweave.wallets.getAddress().then((res: string) => {
          subscriber.next(res);
          subscriber.complete();
        }).catch((error: any) => {
          subscriber.error(error);
        });

      } else if (method === 'webwallet') {

        this.arweaveWebWallet.connect().then((res: string) => {
          subscriber.next(res);
          subscriber.complete();
        }).catch((error: any) => {
          subscriber.error(error);
        });

      } else {
        subscriber.error('Wrong login method!');
      }
      
    })

    return obs.pipe(
      catchError(this.errorHandler)
    );

  }

  /*
  *  @dev Error handler
  */ 
  errorHandler(
    error: any
  ) {
    let errorMsg = 'Error!';
    console.error('Debug ArweaveServ:', error);
    return throwError(errorMsg);
  }

  /*
  *  @dev Login by keyfile
  */
  uploadKeyFile(inputEvent: any): Observable<any> {
    let method = new Observable<any>((subscriber) => {
       // Transform .json file into key
       try {
        const file = inputEvent.target.files.length ? 
          inputEvent.target.files[0] : null;

        const freader = new FileReader();
        freader.onload = async (_keyFile) => {
          const key = JSON.parse(freader.result + '');
          try {
            const address = await this.arweave.wallets.jwkToAddress(key);
            const tmp_res = {
              address: address,
              key: key
            };
            
            subscriber.next(tmp_res);
            subscriber.complete();
          } catch (error) {
            throw Error('Error loading key');
          }
        }

        freader.onerror = () => {
          throw Error('Error reading file');
        }

        freader.readAsText(file);

       } catch (error) {
         subscriber.error(error);
       }
      
    });

    return method;

  }

  /*
  * @dev Convert Winston to Ar
  */
  winstonToAr(balance: string) {
    return this.arweave.ar.winstonToAr(balance);
  }


  /*
  * @dev Convert AR to Winston
  */
  arToWinston(balance: string) {
    return this.arweave.ar.arToWinston(balance);
  }


  /*
  * @dev Get balance from account
  */
  getAccountBalance(_address: string): Observable<string> {
    return from(this.arweave.wallets.getBalance(_address)).pipe(
      map((balance) => {
        let arBalance = this.winstonToAr(balance);
        return arBalance;
      }),
      catchError(this.errorHandler)
    );
  }

  /*
  * @dev Get last transaction from account
  */
  getLastTransactionID(_address: string): Observable<string> {
    return from(this.arweave.wallets.getLastTransactionID(_address)).pipe(
      catchError(this.errorHandler)
    );
  }

  /*
  * @dev Helper method
  */
  fileToArrayBuffer(file: any): Observable<any> {
    let method = new Observable<any>((subscriber) => {
    // Transform .json file into key
    try {
        const freader = new FileReader();
        freader.onload = async () => {
          const data = freader.result;
          try {
            subscriber.next(data);
            subscriber.complete();
          } catch (error) {
            throw Error('Error loading file');
          }
        }

        freader.onerror = () => {
          throw Error('Error reading file');
        }

        freader.readAsArrayBuffer(file);

       } catch (error) {
         subscriber.error(error);
       }
      
    });
    return method;
  }

  /*
  * @dev Upload a file to the permaweb
  */
  async uploadFileToArweave(fileBin: any, contentType: string, key: any): Promise<any> {
    // Create transaction
    let transaction = await this.arweave.createTransaction({
        data: fileBin,
    }, key);

    transaction.addTag('Content-Type', contentType);
    transaction.addTag('Service', 'PublicSquare');

    // Sign transaction
    await this.arweave.transactions.sign(transaction, key);

    // Submit transaction 
    let uploader = await this.arweave.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }

    return transaction;
  }

  /*
  * @dev Helper function
  */
  private async sendDonationHelper(_to: string, _fee: string, jwk: any): Promise<Transaction> {
    // send a fee. You should inform the user about this fee and amount.
    const tx = await this.arweave.createTransaction({ 
      target: _to, quantity: this.arweave.ar.arToWinston(_fee) 
    }, jwk)
    tx.addTag('Service', 'PublicSquare');
    tx.addTag('Type', 'Donation');

    await this.arweave.transactions.sign(tx, jwk);
    const response = await this.arweave.transactions.post(tx);

    if (response && response.status) {
      // 200 - ok, 400 - invalid transaction, 500 - error
      if (response.status === 400) {
        throw new Error('Invalid transaction! (400)');
      }
      if (response.status === 500) {
        throw new Error('Error! (500)');
      }
    }
    return tx;
  }

  /*
  * @dev Send a donation to a user
  */
  sendDonation(_to: string, _fee: string, jwk: any): Observable<Transaction> {
    return from(this.sendDonationHelper(_to, _fee, jwk));
  }

  /*
  * @dev Get TX status
  */
  getTxStatus(_tx: string): Observable<TransactionStatusResponse> {
    return from(this.arweave.transactions.getStatus(_tx));
  }

  /*
  * @dev Get tx data as string
  */
  getDataAsString(txId: string): Observable<string | Uint8Array> {
    return from(this.arweave.transactions.getData(txId, {decode: true, string: true}));
  }

  /**
   * Formats a block number into human readable hours, days, months, years.
   * Original src from: https://github.com/CommunityXYZ/community-js/blob/master/src/utils.ts
   * @param len block length
   */
  public formatBlocks(len: number = 720): string {
    const minute = this.blockToSeconds * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = week * 4;
    const year = month * 12;
    const ops = [
      ['Y', year], ['M', month], ['W', week], 
      ['D', day], ['h', hour], ['m', minute],
      ['s', this.blockToSeconds]
    ];
    let res = '';
    let accum = len;
    for (const o of ops) {
      const val = Math.floor(accum / +o[1]);
      accum = accum - (val * +o[1]);
      if (val > 0) {
        res += `${val}${o[0]} `;
      }
    }
    res = res ? `~${res}` : '';
    return res;
  }
}
