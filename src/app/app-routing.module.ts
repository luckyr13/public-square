import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
	{
		path: 'sq', loadChildren: () => import('./squares/squares.module').then(m => m.SquaresModule)
	},
	{ 
		path: '', loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
	},
	{ 
		path: '**', component: PageNotFoundComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(
  	routes,
	  {
	    preloadingStrategy: PreloadAllModules
	  }
	)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
