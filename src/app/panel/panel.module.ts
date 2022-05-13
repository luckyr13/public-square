import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { PanelRoutingModule } from './panel-routing.module';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    SharedModule
  ]
})
export class PanelModule { }
