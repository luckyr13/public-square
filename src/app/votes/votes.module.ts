import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VotesRoutingModule } from './votes-routing.module';
import { VotesComponent } from './votes.component';


@NgModule({
  declarations: [
    VotesComponent
  ],
  imports: [
    CommonModule,
    VotesRoutingModule
  ]
})
export class VotesModule { }
