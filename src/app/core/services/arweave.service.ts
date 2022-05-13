import { Injectable } from '@angular/core';
import { Observable, throwError, from, map, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import Arweave from 'arweave';
import { NetworkInfoInterface } from 'arweave/web/network';
import { TransactionStatusResponse } from 'arweave/web/transactions';
import Transaction from 'arweave/web/lib/transaction';
import { JWKInterface } from 'arweave/web/lib/wallet';
import { ArweaveWebWallet } from 'arweave-wallet-connector';
declare const window: any;

export const arweaveAddressLength = 43;

@Injectable({
  providedIn: 'root'
})
export class ArweaveService {
  public readonly arweave: Arweave;
  public readonly host: string = 'arweave.net';
  public readonly protocol: string = 'https';
  public readonly port: number = 443;
  public readonly baseURL: string = `${this.protocol}://${this.host}:${this.port}/`;
  public readonly blockToSeconds: number = 0.5 / 60;
  public readonly arweaveWebWallet = new ArweaveWebWallet({
    name: 'Public Square',
    logo: 'https://arweave.net/wJGdli6nMQKCyCdtCewn84ba9-WsJ80-GS-KtKdkCLg'
  });

  public readonly appInfo = { name: 'Public Square', logo: '' };

  constructor() {
    this.arweave = Arweave.init({
      host: this.host,
      port: this.port,
      protocol: this.protocol,
    });

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
      // If ArConnect
      if (method === 'arconnect') {
        if (!(window && window.arweaveWallet)) {
          subscriber.error('Login method not available!');
        }
        // Get main account
        window.arweaveWallet.connect([
          'ACCESS_ADDRESS', 'ACCESS_ALL_ADDRESSES',
          'SIGN_TRANSACTION', 'DISPATCH'
        ]).then(async () => {
          const address = await this.arweave.wallets.getAddress();
          subscriber.next(address);
          subscriber.complete();
        }).catch((error: any) => {
          subscriber.error(error);
        });
      } // Arweave Web Wallet
      else if (method === 'arweavewebwallet') {
        this.arweaveWebWallet.connect().then((res: string) => {
          subscriber.next(res);
          subscriber.complete();
        }).catch((error: any) => {
          subscriber.error(error);
        });
      } // Finnie wallet
      else if (method === 'finnie') {
        if (!(window && window.arweaveWallet)) {
          subscriber.error('Login method not available!');
        }
        // Get main account
        window.arweaveWallet.connect([
          'ACCESS_ADDRESS', 'ACCESS_ALL_ADDRESSES', 'SIGN_TRANSACTION'
        ]).then(async () => {
          const address = await this.arweave.wallets.getAddress();
          subscriber.next(address);
          subscriber.complete();
        }).catch((error: any) => {
          subscriber.error(error);
        });
      }else {
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
  private async _uploadFileToArweave(
    fileBin: any,
    contentType: string,
    key: JWKInterface | "use_wallet",
    tags: {name: string, value: string}[],
    loginMethod: string,
    disableDispatch: boolean): Promise<Transaction|{id: string, type: string}> {
    // Check if the login method allows dispatch
    if (!disableDispatch) {
      if (loginMethod !== 'arconnect' && loginMethod !== 'arweavewebwallet') {
        throw new Error('Dispatch is not available for this login method!');
      }
    }

    // Create transaction
    let transaction = await this.arweave.createTransaction({
        data: fileBin,
    }, key);

    transaction.addTag('Content-Type', contentType);
    for (const t of tags) {
      transaction.addTag(t.name, t.value);
    }

    // If ArConnect try Dispatch first
    // Limit: 100kb
    const dataSizeLimitDispatch = 100000;
    if (loginMethod === 'arconnect' && !disableDispatch) {
      if (!(window && window.arweaveWallet)) {
        throw new Error('ArConnect method not available!');
      }

      if (+(transaction.data_size) > dataSizeLimitDispatch) {
        throw new Error(`Dispatch is not available for data size > ${dataSizeLimitDispatch} bytes.`);
      }

      const dispatchResult = await window.arweaveWallet.dispatch(transaction);
      console.log('Trying dispatch method ...', dispatchResult);
      // Return Dispatch result
      return dispatchResult;

    } // Else, try ArConnect Sign method
    else if (loginMethod === 'arconnect') {
      if (!(window && window.arweaveWallet)) {
        throw new Error('ArConnect method not available!');
      }

      console.log('Signing transaction ...');

      // Sign transaction
      await this.arweave.transactions.sign(transaction, key);
      // Submit transaction 
      let uploader = await this.arweave.transactions.getUploader(transaction);
      while (!uploader.isComplete) {
        await uploader.uploadChunk();
        console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
      }
    } else if (loginMethod === 'arweavewebwallet' && !disableDispatch) {
      if (!(window && window.arweaveWallet)) {
        throw new Error('Arweave Wallet method not available!');
      }

      if (+(transaction.data_size) > dataSizeLimitDispatch) {
        throw new Error(`Dispatch is not available for data size > ${dataSizeLimitDispatch} bytes.`);
      }

      const dispatchResult = await window.arweaveWallet.dispatch(transaction);
      console.log('Trying dispatch method ...', dispatchResult);
      // Return Dispatch result
      return dispatchResult;

    } else {
      console.log('Signing transaction ...');

      // Sign transaction
      await this.arweave.transactions.sign(transaction, key);
      // Submit transaction 
      let uploader = await this.arweave.transactions.getUploader(transaction);
      while (!uploader.isComplete) {
        await uploader.uploadChunk();
        console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
      }
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
    tx.addTag('Application', 'PublicSquare');
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
    return from(fetch(`${this.baseURL}${txId}`)).pipe(
        switchMap((res: Response) => {
          if (!res.ok) {
            throw new Error('Error fetching data from gw ...');
          }
          return from(res.text());
        }),
        catchError((error) => {
          console.warn(`Fetching ${txId} data using method 2 ...`);
          return from(this.arweave.transactions.getData(txId, {decode: true, string: true})).pipe(
            // Handle when it fails
          );
        })
      );
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

  /*
  * @dev Upload a file to the permaweb
  */
  uploadFileToArweave(
      fileBin: any,
      contentType: string,
      key:  JWKInterface | "use_wallet",
      tags: {name: string, value: string}[],
      method: string,
      disableDispatch: boolean): Observable<Transaction | {id: string, type: string}> {
    return from(this._uploadFileToArweave(fileBin, contentType, key, tags, method, disableDispatch));
  }

  validateAddress(address: string) {
    // Validate address 
    if (address && address.length === arweaveAddressLength) {
      return true;
    }

    return false;
  }

  private async _generateSignedTx(
    fileBin: any,
    contentType: string,
    key:  JWKInterface | "use_wallet",
    tags: {name: string, value: string}[] = []
  ): Promise<Transaction> {
    // Create transaction
    let transaction = await this.arweave.createTransaction({
        data: fileBin,
    }, key);

    transaction.addTag('Content-Type', contentType);
    for (const t of tags) {
      transaction.addTag(t.name, t.value);
    }

    await this.arweave.transactions.sign(transaction, key);

    return transaction;
  }

  public generateSignedTx(
    fileBin: any,
    contentType: string,
    key:  JWKInterface | "use_wallet",
    tags: {name: string, value: string}[] = []
  ): Observable<Transaction> {
    return from(this._generateSignedTx(fileBin, contentType, key, tags));
  }
}
