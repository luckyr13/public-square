import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileNotFoundRoutingModule } from './profile-not-found-routing.module';
import { ProfileNotFoundComponent } from './profile-not-found.component';


@NgModule({
  declarations: [
    ProfileNotFoundComponent
  ],
  imports: [
    CommonModule,
    ProfileNotFoundRoutingModule
  ]
})
export class ProfileNotFoundModule { }
