import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { PostComponent } from './post/post.component';
import { LatestStoriesComponent } from './latest-stories/latest-stories.component';
import { ProfileResolverService } from '../core/route-guards/profile-resolver.service';
import { RepliesComponent } from './replies/replies.component';
import { LikesComponent } from './likes/likes.component';
import { PendingComponent } from './pending/pending.component';

const routes: Routes = [
	{
		path: '',
		component: ProfileComponent,
		resolve: {
			profile: ProfileResolverService
		},
		children: [
			{
				path: 'replies', component: RepliesComponent, resolve: {profile: ProfileResolverService}
			},
			{
				path: 'likes', component: LikesComponent, resolve: {profile: ProfileResolverService}
			},
			{
				path: 'pending', component: PendingComponent, resolve: {profile: ProfileResolverService}
			},
			{
				path: ':storyId', component: PostComponent, resolve: {profile: ProfileResolverService}
			},
			{
				path: '', component: LatestStoriesComponent, pathMatch: 'full'
			},
		]
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
