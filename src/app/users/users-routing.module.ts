import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogoutComponent } from './logout/logout.component';
import { InitPlatformGuard } from '../core/route-guards/init-platform.guard';
import { InitPlatformAuthGuard } from '../core/route-guards/init-platform-auth.guard';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		pathMatch: 'full',
		canActivate: [InitPlatformGuard]
	},
	{
		path: '',
		canActivateChild: [InitPlatformAuthGuard],
		children: [
			{
				path: 'dashboard', component: DashboardComponent
			},
			{
				path: 'logout', component: LogoutComponent
			}
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
