import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileNotFoundComponent } from './profile-not-found.component';

const routes: Routes = [{ path: '', component: ProfileNotFoundComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileNotFoundRoutingModule { }
