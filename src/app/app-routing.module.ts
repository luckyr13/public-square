import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InitPlatformGuard } from './core/route-guards/init-platform.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		pathMatch: 'full',
		canActivate: [InitPlatformGuard]
	},
	{ path: '', loadChildren: () => import('./panel/panel.module').then(m => m.PanelModule) },
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
