import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../shared/shared.module';
import { ApplicationComponent } from './application/application.component';
import { NetworkComponent } from './network/network.component';
import { AppearanceComponent } from './appearance/appearance.component';
import { LanguageComponent } from './language/language.component';
import { WalletComponent } from './wallet/wallet.component';


@NgModule({
  declarations: [
    SettingsComponent,
    ApplicationComponent,
    NetworkComponent,
    AppearanceComponent,
    LanguageComponent,
    WalletComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
