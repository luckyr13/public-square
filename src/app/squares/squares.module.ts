import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SquaresRoutingModule } from './squares-routing.module';
import { SquaresComponent } from './squares.component';


@NgModule({
  declarations: [
    SquaresComponent
  ],
  imports: [
    CommonModule,
    SquaresRoutingModule
  ]
})
export class SquaresModule { }
