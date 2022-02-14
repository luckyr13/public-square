import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { InitPlatformAuthGuard } from '../core/route-guards/init-platform-auth.guard';

const routes: Routes = [{ 
	path: '', 
	component: SettingsComponent,
	canActivate: [InitPlatformAuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
