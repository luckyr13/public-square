import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseComponent } from './browse.component';
import { ResultsComponent } from './results/results.component';
import { TrendingComponent } from './trending/trending.component';

const routes: Routes = [
  {
    path: '',
    component: BrowseComponent,
    children: [
      { path: ':query', component: ResultsComponent },
      { path: '', component: TrendingComponent, pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrowseRoutingModule { }
