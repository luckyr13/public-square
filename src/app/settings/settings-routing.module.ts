import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { ApplicationComponent } from './application/application.component';
import { AppearanceComponent } from './appearance/appearance.component';
import { LanguageComponent } from './language/language.component';
import { NetworkComponent } from './network/network.component';
import { WalletComponent } from './wallet/wallet.component';


const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: 'application', component: ApplicationComponent },
      { path: 'appearance', component: AppearanceComponent },
      { path: 'network', component: NetworkComponent },
      { path: 'wallet', component: WalletComponent },
      { path: 'language', component: LanguageComponent },
      { path: '', pathMatch: 'full', redirectTo: 'application' } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
