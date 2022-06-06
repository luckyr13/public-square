import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { from, Observable, Subscription, concatMap, of } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';
import { PostService } from '../../core/services/post.service';

@Component({
  selector: 'app-submit-post-dialog',
  templateUrl: './submit-post-dialog.component.html',
  styleUrls: ['./submit-post-dialog.component.scss']
})
export class SubmitPostDialogComponent implements OnInit {
  useDispatch = new UntypedFormControl(false);
  loadingPostingSubstories = false;
  loadingPostingMainStory = false;
  postingSubstoriesSubscription = Subscription.EMPTY;
  postingMainStorySubscription = Subscription.EMPTY;

  constructor(
    private _dialogRef: MatDialogRef<SubmitPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      address: string,
      substories: {id: string, content: string, type: 'text'|'image', arrId: number}[],
      mainStory: string
    },
    private _utils: UtilsService,
    private _post: PostService) { }


  ngOnInit(): void {
  }

  close(mainTx: string = '') {
    this._dialogRef.close(mainTx);
  }

  submit() {
    const disableDispatch = !this.useDispatch.value;
    const substoriesTxList: string[] = [];

    const textSubstories = this.data.substories.filter((substory) => {
      return substory.type === 'text';
    });

    const imagesSubstories = this.data.substories.filter((substory) => {
      return substory.type === 'image';
    });
    const imagesTxList = imagesSubstories.map((substory) => {
      return substory.id;
    });

    // Substories detected?
    if (this.data.substories && this.data.substories.length) {
      this.loadingPostingSubstories = true;
      this.postingSubstoriesSubscription = from(textSubstories).pipe(
        concatMap((substory) => {
          if (substory.id) {
            return of({id: substory.id});
          }
          return this._post.createPost(substory.content, disableDispatch, [], true, 'text');
        })
      ).subscribe({
        next: (tx) => {
          substoriesTxList.push(tx.id);
        },
        error: (err) => {
          if (typeof err === 'string') {
            this._utils.message(err, 'error');
          } else if (err && err.message) {
            this._utils.message(err.message, 'error');
          } else {
            this._utils.message('Error :(', 'error');
          }
          this.loadingPostingSubstories = false;
          this.close('');
        },
        complete: () => {
          this.loadingPostingSubstories = false;
          substoriesTxList.push(...imagesTxList);
          this.createMainStory(this.data.mainStory, substoriesTxList, disableDispatch);
        }
      });
    } else {
      substoriesTxList.push(...imagesTxList);
      this.createMainStory(this.data.mainStory, substoriesTxList, disableDispatch);
    }
  }

  createMainStory(story: string, substoriesTXIds: string[], disableDispatch: boolean) {
    this.loadingPostingMainStory = true;
    const tags = [];

    // Generate tags for Substories
    for (const txId of substoriesTXIds) {
      tags.push({ name: 'Substory', value: txId });
    }

    this.postingSubstoriesSubscription = this._post.createPost(story, disableDispatch, tags, false, 'text').subscribe({
      next: (tx) => {
        this.loadingPostingMainStory = false;
        this._utils.message('Post created!', 'success');
        this.close(tx.id);
      },
      error: (err) => {
        if (typeof err === 'string') {
          this._utils.message(err, 'error');
        } else if (err && err.message) {
          this._utils.message(err.message, 'error');
        } else {
          this._utils.message('Error :(', 'error');
        }
        this.loadingPostingMainStory = false;
        this.close('');
      }
    });
  }

  ngOnDestroy() {

  }


}
