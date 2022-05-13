import { Injectable } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { Observable, EMPTY, of, throwError, Subject, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private _account: Subject<string>;
  // Observable string streams
  public account$: Observable<string>;
  // User's private key
  private _arKey: any = null;
  // User's arweave public address
  private _mainAddress: string = '';
  // Login method 
  private _method: string = '';


  constructor(
    private _arweave: ArweaveService) {
    this._account = new Subject<string>();
    this.account$ = this._account.asObservable();
   
  }

  public get loginMethod(): string {
    return this._method;
  }

  public loadAccount(): Observable<boolean> {
    return new Observable((subscriber) => {
      const stayLoggedIn = !!window.sessionStorage.getItem('STAY_LOGGED_IN')
        || !!window.localStorage.getItem('STAY_LOGGED_IN');
      const storage = stayLoggedIn ? window.localStorage : window.sessionStorage;
      const method = storage.getItem('METHOD');
    
      // Private key method
      if (method === 'pkFile') {
        const arkey = storage.getItem('ARKEY');
        this._arKey = JSON.parse(arkey!);
        this._arweave.arweave.wallets.jwkToAddress(this._arKey).then((address) => {
          this.setAccount(address, this._arKey, stayLoggedIn, 'pkFile', '');
          subscriber.next(!!address);
          subscriber.complete();
        }).catch((reason) => {
          subscriber.error(reason);
        });
      } else if (method === 'arconnect' ||
          method === 'finnie')  {
        window.addEventListener('arweaveWalletLoaded', (e) => {
          this.login(method, null, stayLoggedIn).subscribe({
            next: (address) => {
              subscriber.next(!!address);
              subscriber.complete();
            },
            error: (error) => {
              subscriber.error(error);
            }
          });
        });
         
      } else if (method === 'arweavewebwallet')  {
        throw new Error('LaunchArweaveWebWalletModal');
      } else {
        subscriber.next(false);
        subscriber.complete();
      }

    });
    
  }

  public setAccount(
    mainAddress: string,
    arKey: any = null,
    stayLoggedIn: boolean = false,
    method='',
    password='') {
    const storage = stayLoggedIn ? window.localStorage : window.sessionStorage;
    this._mainAddress = mainAddress;
    this._method = method;
    storage.setItem('METHOD', method);
    storage.setItem('STAY_LOGGED_IN', stayLoggedIn ? '1' : '');
    if (arKey) {
      this._arKey = arKey
      storage.setItem('ARKEY', JSON.stringify(this._arKey))
    }
    this._account.next(mainAddress);
  }

  public addressChangeListener(mainAddress: string, stayLoggedIn: boolean, method: string) {
    if (method === 'arconnect') {
      if (!(window && window.arweaveWallet)) {
        throw Error('ArConnect not found');
      }
      window.addEventListener('walletSwitch', (e) => {
        if (this._mainAddress !== e.detail.address) {
          this.setAccount(e.detail.address, null, stayLoggedIn, method);
        }
      });

    } else if (method === 'arweavewebwallet') {
      if (!(window && window.arweaveWallet)) {
        throw Error('ArweaveWallet not found');
      }

      this._arweave.arweaveWebWallet.on('connect', (address) => {
        this.setAccount(address, null, stayLoggedIn, method);
      });
      this._arweave.arweaveWebWallet.on('disconnect', () => {
        //this.logout()
      });
    }
  }

  public removeAccount() {
    this._account.next('');
    this._mainAddress = '';
    this._method = '';
    this._arKey = null;
    for (let key of ['MAINADDRESS', 'ARKEY', 'METHOD', 'STAY_LOGGED_IN']) {
      window.sessionStorage.removeItem(key)
      window.localStorage.removeItem(key)
    }

  }


  public getMainAddressSnapshot(): string {
    return this._mainAddress;
  }

  public getPrivateKey() {
    return this._arKey ? this._arKey : 'use_wallet'
  }

  public login(walletOption: string, uploadInputEvent: any = null, stayLoggedIn: boolean = false): Observable<string> {
    let method = of('');

    switch (walletOption) {
      case 'pkFile':
        method = this._arweave.uploadKeyFile(uploadInputEvent).pipe(
            tap( (_res: any) => {
              this.removeAccount();
              this.setAccount(_res.address, _res.key, stayLoggedIn, walletOption)
            })
          );
      break;
      case 'arconnect':
        method = this._arweave.getAccount(walletOption).pipe(
            tap( (_account: any) => {
              this.removeAccount();
              this.setAccount(_account.toString(), null, stayLoggedIn, walletOption);
              this.addressChangeListener(_account.toString(), stayLoggedIn, walletOption);
            })
          );
      break;
      case 'arweavewebwallet':
        method = this._arweave.getAccount(walletOption).pipe(
            tap( (_account: any) => {
              this.removeAccount();
              this.setAccount(_account.toString(), null, stayLoggedIn, walletOption);
              this.addressChangeListener(_account.toString(), stayLoggedIn, walletOption);
            })
          );
      break;
      case 'finnie':
        method = this._arweave.getAccount(walletOption).pipe(
            tap( (_account: any) => {
              this.removeAccount();
              this.setAccount(_account.toString(), null, stayLoggedIn, walletOption);
            })
          );
      break;
      default:
        return throwError('Wallet not supported');
      break;
    }

    return method;
  }

  public logout() {
    if ((this._method === 'finnie' || 
        this._method === 'arconnect' || 
        this._method === 'arweavewebwallet') &&
        (window && window.arweaveWallet)) {
      window.arweaveWallet.disconnect();
    }
    this.removeAccount();
  }

  public destroySession() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.location.reload();
  }

  public getSessionData() {
    return {
      localStorage: window.localStorage,
      sessionStorage: window.sessionStorage
    }
  }

  public getStayLoggedIn() {
    const stayLoggedIn = !!window.sessionStorage.getItem('STAY_LOGGED_IN')
        || !!window.localStorage.getItem('STAY_LOGGED_IN');
    return stayLoggedIn;
  }


}
