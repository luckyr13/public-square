import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BottomSheetLoginComponent } from './bottom-sheet-login/bottom-sheet-login.component';
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';


@NgModule({
  declarations: [
    BottomSheetLoginComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  exports: [
  	MatToolbarModule,
  	MatIconModule,
  	MatButtonModule,
  	MatSidenavModule,
    MatProgressBarModule,
    MatListModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatBottomSheetModule
  ]
})
export class SharedModule { }
