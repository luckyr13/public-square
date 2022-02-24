import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../../core/services/post.service';
import { Subscription } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private _postSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  public posts: Array<any> = [];
  private maxPosts: number = 10;
  public loadingPosts = false;

  constructor(
    private _post: PostService,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.loadingPosts = true;

    this._postSubscription = this._post.getLatestPosts([], this.maxPosts).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loadingPosts = false;
      },
      error: (error) => {
        this.loadingPosts = false;
        this.message(error, 'error');
      }
    })

  }

  moreResults() {
    this.loadingPosts = true;
    this._nextResultsSubscription = this._post.next().subscribe({
      next: (posts) => {
        this.posts = this.posts.concat(posts);
        this.loadingPosts = false;
      },
      error: (error) => {
        this.loadingPosts = false;
        this.message(error, 'error');
      }
    })
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
  }

  /*
  *  Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 8000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

}
