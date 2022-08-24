import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap, concat, of, merge, from, mergeMap } from 'rxjs';
import { SearchService } from '../../core/services/search.service';
import { PostService } from '../../core/services/post.service';
import { UtilsService } from '../../core/utils/utils.service';
import { ArweaveService } from '../../core/services/arweave.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { NetworkInfoInterface } from 'arweave/web/network';
import { VertoService } from '../../core/services/verto.service';
import { UserInterface } from '@verto/js/dist/common/faces';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  query: string = '';
  loadingPosts = false;
  loadingProfiles = false;
  posts: TransactionMetadata[] = [];
  moreResultsAvailable = true;
  private _postSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  private _vertoProfileSubscription: Subscription = Subscription.EMPTY;
  private maxPosts: number = 10;
  profiles: UserInterface[] = [];
  defaultProfileImage = 'assets/images/blank-profile.jpg';

  constructor(
    private _route: ActivatedRoute,
    private _utils: UtilsService,
    private _search: SearchService,
    private _arweave: ArweaveService,
    private _post: PostService,
    private _verto: VertoService) { }

  ngOnInit(): void {

    this._route.paramMap.subscribe(async params => {
      this.query = params.get('query')! ? `${params.get('query')!}`.trim() : '';
      this.loadPosts(this.query);

      this._search.updateQueryStream(this.query);
      
    });

  }


  breakQuery(q: string): {hashtags: string[], mentions: string[], from: string[]} {
    const words = q.split(' ');
    const numWords = words.length;
    const res: {hashtags: string[], mentions: string[], from: string[]} = {hashtags: [], mentions: [], from: []};
    for (let i = 0; i < numWords; i++) {
      let word = this._utils.removeInitialSymbol(words[i].trim(), '#');
      word = this._utils.removeInitialSymbol(word, '@');

      // Hashtag
      res.hashtags.push(`#${word.toLowerCase()}`);
      res.hashtags.push(`#${word}`);

      // Mention
      res.mentions.push(`@${word.toLowerCase()}`);
      res.mentions.push(`@${word}`);

      // Address
      if (this._arweave.validateAddress(word)) {
        res.from.push(word);
      }
    }
    
    return res;
  }

  getStoriesIfFrom(fromAddr: string[], height: number) {
    if (fromAddr.length) {
      return this._post.getLatestPosts(fromAddr, this.maxPosts, height);
    } else {
      // clear query
      this._post.resetArDB();
    }

    return of([]);
  }


  loadPosts(q: string) {
    const res = this.breakQuery(q);
    let numPostsFound = 0;

    // Search and load profiles
    const mentions = res.mentions.map((v) => {
      return this._utils.removeInitialSymbol(v, '@');
    });
    this.loadProfiles(mentions, res.from);
    
    // Load posts
    this.loadingPosts = true;
    this.posts = [];
    this._postSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return merge(
          this._search.getLatestPostsHashtags(
            [],
            res.hashtags,
            this.maxPosts,
            currentHeight),
          this._search.getLatestPostsMentions(
            [],
            res.mentions,
            this.maxPosts,
            currentHeight),
          this.getStoriesIfFrom(
            res.from,
            currentHeight),
        )
      })
    ).subscribe({
      next: (posts) => {
        if (posts && posts.length) {
          numPostsFound += posts.length;
        }
        this.posts.push(...posts);
        
      },
      error: (error) => {
        this.loadingPosts = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      },
      complete: () => {
        if (!numPostsFound) {
          this.moreResultsAvailable = false;
        } else {
          this.moreResultsAvailable = true;
        }

        this.loadingPosts = false;
      }
    })

  }


  moreResults() {
    this.loadingPosts = true;
    let numPostsFound = 0;
    this._nextResultsSubscription = merge(
      this._search.nextHashtags(),
      this._search.nextMentions(),
      this._post.next()
    ).subscribe({
      next: (posts) => {
        if (posts && posts.length) {
          numPostsFound += posts.length;
        }
        this.posts = this.posts.concat(posts);
      },
      error: (error) => {
        this.loadingPosts = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      },
      complete: () => {
        if (!numPostsFound) {
          this.moreResultsAvailable = false;
        } else {
          this.moreResultsAvailable = true;
        }

        this.loadingPosts = false;
      }
    })
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
    this._vertoProfileSubscription.unsubscribe();
  }

  loadProfiles(mentions: string[], fromAddr: string[]) {
    let numProfilesFound = 0;
    
    this.loadingProfiles = true;
    this.profiles = [];

    const query = mentions.concat(fromAddr);

    const fQuery: string[] = [];

    for (let q of query) {
      if (fQuery.indexOf(q) < 0) {
        fQuery.push(q);
      }
    }
    this._vertoProfileSubscription = from(fQuery).pipe(
      mergeMap((addr: string) => {
        return this._verto.getProfile(addr);
      }),
    ).subscribe({
      next: (profile) => {
        if (profile && this.profiles.find((p) => p.username === profile.username) === undefined) {
          this.profiles.push(profile);
        }
      }
    });
  }

  getImageUrl(txId: string) {
    var imgUrl = this._arweave.getImageUrl(txId);
    if (!imgUrl) {
      imgUrl = this.defaultProfileImage;
    }
    return imgUrl;
  }


}
