import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowseRoutingModule } from './browse-routing.module';
import { BrowseComponent } from './browse.component';
import { SharedModule } from '../shared/shared.module';
import { ResultsComponent } from './results/results.component';
import { TrendingComponent } from './trending/trending.component';


@NgModule({
  declarations: [
    BrowseComponent,
    ResultsComponent,
    TrendingComponent
  ],
  imports: [
    CommonModule,
    BrowseRoutingModule,
    SharedModule
  ]
})
export class BrowseModule { }
