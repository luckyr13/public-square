import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { LatestStoriesComponent } from './latest-stories/latest-stories.component';
import { RepliesComponent } from './replies/replies.component';
import { LikesComponent } from './likes/likes.component';
import { PendingComponent } from './pending/pending.component';
import { PostComponent } from './post/post.component';


@NgModule({
  declarations: [
    ProfileComponent,
    LatestStoriesComponent,
    RepliesComponent,
    LikesComponent,
    PendingComponent,
    PostComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }
