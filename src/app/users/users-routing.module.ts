import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { PostComponent } from './post/post.component';
import { LatestStoriesComponent } from './latest-stories/latest-stories.component';
import { ProfileResolverService } from '../core/route-guards/profile-resolver.service';
import { RepliesComponent } from './replies/replies.component';
import { LikesComponent } from './likes/likes.component';
import { PendingComponent } from './pending/pending.component';
import { FollowersComponent } from './followers/followers.component';
import { FollowingComponent } from './following/following.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditProfileBannerComponent } from './edit-profile-banner/edit-profile-banner.component';

const routes: Routes = [
	{
		path: '',
		component: ProfileComponent,
		resolve: {
			profile: ProfileResolverService
		},
		children: [
			{
				path: 'replies', component: RepliesComponent
			},
			{
				path: 'likes', component: LikesComponent
			},
			{
				path: 'pending', component: PendingComponent
			},
			{
				path: 'followers', component: FollowersComponent
			},
			{
				path: 'following', component: FollowingComponent
			},
			{
				path: 'edit', component: EditProfileComponent
			},
			{
				path: 'edit-banner', component: EditProfileBannerComponent
			},
			{
				path: ':storyId', component: PostComponent
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
