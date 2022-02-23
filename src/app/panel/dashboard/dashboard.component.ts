import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../../core/services/post.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private _postSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  public posts: Array<any> = [];
  private maxPosts: number = 5;

  constructor(private _post: PostService) { }

  ngOnInit(): void {
    this._postSubscription = this._post.getLatestPosts([], this.maxPosts).subscribe({
      next: (posts) => {
        console.log(posts)
        this.posts = posts;
        console.log('posts', posts)
      },
      error: () => {

      }
    })

  }

  moreResults() {
    this._nextResultsSubscription = this._post.next().subscribe({
      next: (posts) => {
        this.posts = this.posts.concat(posts);
        console.log('posts', posts)
      },
      error: () => {

      }
    })
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
  }

}
