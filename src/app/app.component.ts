import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSettingsService } from './core/services/user-settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'public-square';
  opened = false;
  platformLoading$ = this._userSettings.loadingPlatform$;
  openerSubscription: Subscription = Subscription.EMPTY;

  constructor(private _userSettings: UserSettingsService) {

  }

  ngOnInit() {
		this.openerSubscription = this._userSettings.showMainToolbar$.subscribe((show) => {
			this.opened = show;
		});
  }

  ngOnDestroy() {
  	this.openerSubscription.unsubscribe();
  }

}
