import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SquaresComponent } from './squares.component';

const routes: Routes = [{ path: '', component: SquaresComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SquaresRoutingModule { }
