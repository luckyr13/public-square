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
import {MatDividerModule} from '@angular/material/divider';
import { CreatePostCardComponent } from './create-post-card/create-post-card.component';
import { PostCardComponent } from './post-card/post-card.component';
import {MatCardModule} from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { VerificationProgressCardComponent } from './verification-progress-card/verification-progress-card.component';
import { ArBalanceCardComponent } from './ar-balance-card/ar-balance-card.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {OverlayModule} from '@angular/cdk/overlay';
import { EmojisComponent } from './emojis/emojis.component';
import {PortalModule} from '@angular/cdk/portal';
import {MatRippleModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    BottomSheetLoginComponent,
    CreatePostCardComponent,
    PostCardComponent,
    VerificationProgressCardComponent,
    ArBalanceCardComponent,
    EmojisComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxSkeletonLoaderModule,
    MatMenuModule,
    OverlayModule,
    PortalModule,
    MatRippleModule,
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
    MatBottomSheetModule,
    MatDividerModule,
    CreatePostCardComponent,
    PostCardComponent,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatRadioModule,
    NgxSkeletonLoaderModule,
    OverlayModule,
    EmojisComponent,
    PortalModule,
    MatRippleModule,
    MatProgressSpinnerModule
  ]
})
export class SharedModule { }
