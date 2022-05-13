import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from '../../core/interfaces/user-profile';
import { ArweaveService } from '../../core/services/arweave.service';
import { UserAuthService } from '../../core/services/user-auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileImage: string = 'assets/images/blank-profile.png';
  username: string = '';
  addressList: string[] = [];
  bio: string = '';
  name: string = '';
  addressRouteParam = '';
  editProfileFlag = false;
  isLoggedIn = false;
  
  constructor(
    private _route: ActivatedRoute,
    private _arweave: ArweaveService,
    private _auth: UserAuthService) { }

  ngOnInit(): void {
    // Profile already loaded
    this._route.data
    .subscribe(data => {
      const profile: UserProfile = data['profile'];
      this.profileImage = 'assets/images/blank-profile.png';
      this.username = '';
      this.bio = '';
      this.addressList = [];
      this.name = '';

      if (profile.profile) {
        if (profile.profile.image) {
          this.profileImage = `${this._arweave.baseURL}${profile.profile.image}`;
        }
        this.name = profile.profile.name;
        this.username = profile.profile.username;
        this.bio = profile.profile.bio!;
        this.addressList = profile.profile.addresses;
      } else if (profile.address) {
        this.addressList = [profile.address];
      }

      // Validate current user
      const currentAddress = this._auth.getMainAddressSnapshot();
      this.isLoggedIn = !!currentAddress;
      this.validateCurrentAddress(currentAddress);
      
    });

    this._route.paramMap.subscribe((params) => {
      this.addressRouteParam = params.get('address')!;
    });

    this._auth.account$.subscribe((currentAddress) => {
      this.isLoggedIn = !!currentAddress;
      this.validateCurrentAddress(currentAddress);
    });

  }

  validateCurrentAddress(currentAddress: string) {
    this.editProfileFlag = false;
    if (this.addressList.indexOf(currentAddress) >= 0) {
      this.editProfileFlag = true;
    }
  }

  

}
