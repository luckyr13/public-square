import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogoutComponent } from './logout/logout.component';
import { InitPlatformGuard } from '../core/route-guards/init-platform.guard';
import { InitPlatformAuthGuard } from '../core/route-guards/init-platform-auth.guard';

const routes: Routes = [
	{
		path: '',
		canActivate: [InitPlatformAuthGuard],
		canActivateChild: [InitPlatformAuthGuard],
		children: [
			{
				path: 'dashboard', component: DashboardComponent
			},
			{
				path: 'squares', loadChildren: () => import('../squares/squares.module').then(m => m.SquaresModule)
			},
			{ path: 'settings', loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule) },
			{ path: 'browse', loadChildren: () => import('../browse/browse.module').then(m => m.BrowseModule) },
			{ path: 'notifications', loadChildren: () => import('../notifications/notifications.module').then(m => m.NotificationsModule) },
			{ path: 'votes', loadChildren: () => import('../votes/votes.module').then(m => m.VotesModule) },
			{ path: 'friends', loadChildren: () => import('../friends/friends.module').then(m => m.FriendsModule) },
			{
				path: 'logout', component: LogoutComponent
			},
			{ path: ':address', loadChildren: () => import('../users/users.module').then(m => m.UsersModule) },
		]
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
