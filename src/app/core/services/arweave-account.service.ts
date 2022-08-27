import { Injectable } from '@angular/core';
import Account from 'arweave-account'
import { ArAccount, ArProfile } from 'arweave-account';
import { from, Observable, map } from 'rxjs';
import { UserProfile } from '../interfaces/user-profile';

/*
* Arweave Account
* https://github.com/MetaweaveTeam/arweave-account
*/

@Injectable({
  providedIn: 'root'
})
export class ArweaveAccountService {
  private readonly _account: Account;

  constructor() {
    const props = {
      cacheIsActivated: true,
      cacheSize: 100,
      cacheTime: 60000,
      gateway: {
        host: 'arweave.net', // Hostname or IP address for a Arweave host
        port: 443, // Port
        protocol: 'https', // Network protocol http or https
        timeout: 20000, // Network request timeouts in milliseconds
        logging: false,
      },
    };
    this._account = new Account(props);
  }

  // Get user profile by wallet address
  getProfile(walletAddr: string): Observable<UserProfile|null> {
    return from(this._account.get(walletAddr)).pipe(
      map((account: ArAccount) => {
        const profile = account && account.profile ? account.profile : null;
        const username = profile && profile.handleName ? profile.handleName : '';
        let newProfile: UserProfile|null = null;
        if (username) {
          newProfile = {
            username: username,
            name: '',
            bio: '',
            address: '',
            avatar: '',
            banner: '',
            avatarURL: '',
            bannerURL: '',
            links: {}
          };
        }
        return newProfile;
      })
    );
  }

  // Search user profile by handle name
  searchProfile(handle: string): Observable<UserProfile[]> {
    return from(this._account.search(handle)).pipe(
      map((accounts: ArAccount[]) => {
        const profiles: UserProfile[] = [];
        for (let account of accounts) {
          const profile = account && account.profile ? account.profile : null;
          const username = profile && profile.handleName ? profile.handleName : '';
          profiles.push({
            username: username,
            name: '',
            bio: '',
            address: '',
            avatar: '',
            banner: '',
            avatarURL: '',
            bannerURL: '',
            links: {}
          });
        }
        return profiles;
      })
    );
  }

  // Find user profile by wallet address & handle name
  findProfile(handleUniqID: string): Observable<UserProfile|null> {
    return from(this._account.find(handleUniqID)).pipe(
      map((account: ArAccount|null) => {
        const profile = account && account.profile ? account.profile : null;
        const username = profile && profile.handleName ? profile.handleName : '';
        let newProfile: UserProfile|null = null;
        if (username) {
          newProfile = {
            username: username,
            name: '',
            bio: '',
            address: '',
            avatar: '',
            banner: '',
            avatarURL: '',
            bannerURL: '',
            links: {}
          };
        }
        return newProfile;
      })
    );
  } 
}
