import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';
import { Subscription } from 'rxjs';
import { ArweaveService } from '../../core/services/arweave.service';
import { UserProfile } from '../../core/interfaces/user-profile';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit, OnDestroy {
  @Input('address') address: string = '';
  profile: UserProfile|null|undefined = null;
  private _profileSubscription = Subscription.EMPTY;
  defaultProfileImage = 'assets/images/blank-profile.jpg';
  loadingProfile = false;
  @Input('disableNavigateToProfile') disableNavigateToProfile = false;
  @Input('hideSecondaryAddressess') hideSecondaryAddressess = false;

  constructor(
    private _profile: ProfileService,
    private _arweave: ArweaveService
  ) { }

  ngOnInit(): void {
    this.loadingProfile = true;
    this._profileSubscription = this._profile.getProfileByAddress(this.address).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loadingProfile = false;
      },
      error: (error) => {
        console.error('ErrProfile:', error);
        this.loadingProfile = false;
      }
    });
  }

  ngOnDestroy() {
    this._profileSubscription.unsubscribe();
  }

  getImageUrl(txId: string) {
    let imgUrl = this._arweave.getImageUrl(txId);
    if (!imgUrl) {
      imgUrl = this.defaultProfileImage;
    }
    return imgUrl;
  }

}
