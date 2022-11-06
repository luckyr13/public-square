import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';
import { InitPlatformGuard } from '../core/route-guards/init-platform.guard';

const routes: Routes = [
	{
		path: 'settings',
		loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule)
	},
	{ path: 'browse', loadChildren: () => import('../browse/browse.module').then(m => m.BrowseModule) },
	{
		path: 'squares', loadChildren: () => import('../squares/squares.module').then(m => m.SquaresModule)
	},
	{
		path: 'logout', component: LogoutComponent
	},
	{ path: ':address', loadChildren: () => import('../users/users.module').then(m => m.UsersModule) }
	
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
