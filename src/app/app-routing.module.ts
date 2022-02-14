import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InitPlatformGuard } from './core/route-guards/init-platform.guard';

const routes: Routes = [
	{
		path: 'sq', loadChildren: () => import('./squares/squares.module').then(m => m.SquaresModule)
	},
	{ 
		path: '', loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
	},
	{ path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
	{ 
		path: '**', component: PageNotFoundComponent, canActivate: [InitPlatformGuard]
	}
];

@NgModule({
  imports: [RouterModule.forRoot(
  	routes,
	  {
	    preloadingStrategy: PreloadAllModules,
	    useHash: true
	  },
	)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
