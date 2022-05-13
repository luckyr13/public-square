import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InitPlatformGuard } from './core/route-guards/init-platform.guard';

const routes: Routes = [
	{
		path: 'home',
		loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
		canActivate: [InitPlatformGuard]
	},
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
	{
		path: 'profile-not-found',
		canActivate: [InitPlatformGuard],
		loadChildren: () => import('./profile-not-found/profile-not-found.module').then(m => m.ProfileNotFoundModule) },
	{
		path: '',
		canActivateChild: [InitPlatformGuard],
		loadChildren: () => import('./panel/panel.module').then(m => m.PanelModule)
	},
	{
		path: '**',
		canActivate: [InitPlatformGuard],
		loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
	},
];

@NgModule({
  imports: [
  	RouterModule.forRoot(routes,
	  {
	    preloadingStrategy: PreloadAllModules,
	    useHash: true
	  })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
