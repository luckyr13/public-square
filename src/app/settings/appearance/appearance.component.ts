import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { UtilsService } from '../../core/utils/utils.service';

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnInit {
  theme = new UntypedFormControl('');

  constructor(
    private _userSettings: UserSettingsService,
    private _utils: UtilsService) { }

  ngOnInit(): void {
    this.theme.setValue(this._userSettings.getDefaultTheme());
    this._userSettings.currentThemeStream.subscribe((theme: string) => {
      this.theme.setValue(theme);
    });
  }

  updateTheme(theme: string) {
    try {
      this._userSettings.setTheme(theme);
    } catch (error) {
      this._utils.message(`Error: ${error}`, 'error');
    }
  }

  getThemesList() {
    return this._userSettings.themeNamesList;
  }

  getThemeObj(theme: string) {
    return this._userSettings.getThemeObj(theme);
  }

}
