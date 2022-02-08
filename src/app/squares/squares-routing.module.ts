import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SquaresComponent } from './squares.component';
import { InitPlatformAuthGuard } from '../core/route-guards/init-platform-auth.guard';

const routes: Routes = [{ 
	path: '',
	component: SquaresComponent,
	canActivate: [InitPlatformAuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SquaresRoutingModule { }
