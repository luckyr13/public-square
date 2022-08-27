import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { ProfileService } from '../../core/services/profile.service';
import { Subscription, Observable } from 'rxjs';
import { UserAuthService } from '../../core/services/user-auth.service';
import { ArweaveService } from '../../core/services/arweave.service';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { UtilsService } from '../../core/utils/utils.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { BottomSheetShareComponent } from '../bottom-sheet-share/bottom-sheet-share.component';
import { Direction } from '@angular/cdk/bidi';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component'; 
import {MatDialog} from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ReplyDialogComponent } from '../reply-dialog/reply-dialog.component';
import { LikeDialogComponent } from '../like-dialog/like-dialog.component';
import { RepostDialogComponent } from '../repost-dialog/repost-dialog.component';
import { PostService } from '../../core/services/post.service';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { UserProfile } from '../../core/interfaces/user-profile';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit, OnDestroy {
  @Input('post') post!: TransactionMetadata;
  @Input('fullMode') fullMode = false;
  @Input('txId') txId: string = '';
  @Input('showActions') showActions = true;
  loadingContent = false;
  loadingProfile = false;
  profileImage = 'assets/images/blank-profile.png';
  profileSubscription = Subscription.EMPTY;
  contentSubscription = Subscription.EMPTY;
  profile: UserProfile|null = null;
  content: string = '';
  originalRawContent: string = '';
  isDarkTheme = false;
  themeSubscription = Subscription.EMPTY;
  @ViewChild('contentContainer') contentContainer!: ElementRef;
  substories: {id: string, type: 'tx'|'youtube'}[] = [];
  service: string = '';
  application: string = '';
  appName: string = '';
  owner: string = '';
  postType: string = '';
  postContentType: string = '';
  contentError = '';
  postVersion: string = '';

  maxPreviewSize = 250;
  realPreviewSize = this.maxPreviewSize;

  loadingPostMetadata = false;
  private _postMetadataSubscription = Subscription.EMPTY;

  repostId: string = '';
  isReposted = false;


  constructor(
    private _profile: ProfileService,
    private _auth: UserAuthService,
    private _arweave: ArweaveService,
    private _userSettings: UserSettingsService,
    private _utils: UtilsService,
    private _bottomSheetShare: MatBottomSheet,
    private _dialog: MatDialog,
    private _location: Location,
    private _post: PostService,
    private _appSettings: AppSettingsService) { }

  ngOnInit(): void {
    if (this.txId) {
      this.loadPostAndThenData(this.txId);
    } else if (this.post) {
      this.loadData();
    }
  }

  loadPostAndThenData(tx: string, recurLv = 0) {
    this.loadingPostMetadata = true;
    this._postMetadataSubscription = this._post.getPostById(tx).subscribe({
      next: (post) => {
        this.post = post;
        this.loadData(recurLv);
      },
      error: (error) => {
        this.loadingPostMetadata = false;
        this._utils.message(error, 'error');
      }
    })
  }

  loadData(recurLv = 0) {
    this.loadProfile();
    this.loadContent(recurLv);
    if (this.post.blockTimestamp) {
      this.post.blockTimestamp = this._utils.dateFormat(this.post.blockTimestamp);
    }
    this.isDarkTheme = this._userSettings.isDarkTheme(this._userSettings.getDefaultTheme());
    this.themeSubscription = this._userSettings.currentThemeStream.subscribe((theme) => {
      this.isDarkTheme = this._userSettings.isDarkTheme(theme);
    });
  }

  extractTagsFromPost(post: TransactionMetadata) {
    const tags = post.tags!;
    if (!tags) {
      console.error('Tags not found', post);
      return;
    }
    for (const t of tags) {
      // Get substories
      if (t.name === 'App-Name') {
        this.appName = t.value;
      } else if (t.name === 'Application') {
        this.application = t.value;
      } else if (t.name === 'Service') {
        this.application = t.value;
      } else if (t.name === 'Type') {
        this.postType = t.value;        
      } else if (t.name === 'Content-Type') {
        this.postContentType = t.value;
      } else if (t.name === 'Version') {
        this.postVersion = t.value;
      } else if (t.name === 'Post-Id') {
        if (this._arweave.validateAddress(t.value)) {
          this.repostId = t.value;
        } else {
          console.error('Invalid Repost Story Id', t);
        }
      }
    }
  }

  loadProfile() {
    const account = this.post.owner;
    this.loadingProfile = true;
    this.profile = null;
    this.profileSubscription = this._profile.getProfileByAddress(account).subscribe({
      next: (profile) => {
        this.profileImage = 'assets/images/blank-profile.jpg';
        
        if (profile) {
          if (profile.avatarURL) {
            this.profileImage = profile.avatarURL;
          }
          this.profile = profile;
        }
        this.loadingProfile = false;
      },
      error: (error) => {
        this.loadingProfile = false;
        this._utils.message(error, 'error');
      }
    });
  }

  ngOnDestroy() {
    this.contentSubscription.unsubscribe();
    this.profileSubscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }

  ellipsis(s: string) {
    return this._utils.ellipsis(s);
  }


  reply(event: MouseEvent) {
    event.stopPropagation();
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';
    const myAddress = this._auth.getMainAddressSnapshot();

    const dialogRef = this._dialog.open(
      ReplyDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          // address: this.account
          myAddress: myAddress,
          txId: this.post.id,
          postOwner: this.post.owner,
          postOwnerUsername: this.profile && this.profile.username ? this.profile.username : '',
          postOwnerImage: this.profileImage,
          postContent: this.originalRawContent,
          contentType: this.postContentType
        },
        direction: direction
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      
    });
  
  }


  repost(event: MouseEvent) {
    event.stopPropagation();
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';
    const myAddress = this._auth.getMainAddressSnapshot();

    const dialogRef = this._dialog.open(
      RepostDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: false,
        data: {
          myAddress: myAddress,
          txId: this.post.id,
          postOwner: this.post.owner,
          postOwnerUsername: this.profile && this.profile.username ? this.profile.username : '',
          postOwnerImage: this.profileImage,
          postContent: this.originalRawContent,
          contentType: this.postContentType
        },
        direction: direction
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
    });
  }

  like(event: MouseEvent) {
    event.stopPropagation();

    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';
    const myAddress = this._auth.getMainAddressSnapshot();

    const dialogRef = this._dialog.open(
      LikeDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          // address: this.account
          myAddress: myAddress,
          txId: this.post.id,
          postOwner: this.post.owner,
          postOwnerUsername: this.profile && this.profile.username ? this.profile.username : '',
          postOwnerImage: this.profileImage,
          postContent: this.originalRawContent,
          contentType: this.postContentType
        },
        direction: direction
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
    });
      
  }

  openStory(event: MouseEvent, txId: string) {
    event.stopPropagation();
    const url = `${this._arweave.baseURL}${txId}`;
    this.confirmDialog(url);
  }


  share(event: MouseEvent) {
    event.stopPropagation();
    const defLang = this._userSettings.getDefaultLang();
    // defLang.writing_system
    const defLangWritingSystem = 'LTR';
    let direction: Direction = defLangWritingSystem === 'LTR' ? 
      'ltr' : 'rtl';
    const tmpContent = this._utils.sanitizeFull(this.originalRawContent);
    const limit = 200;
    const user = this.profile && this.profile.username ? 
      this.profile.username :
      this.post.owner;


    this._bottomSheetShare.open(BottomSheetShareComponent, {
      data: {
        title: 'Post from Public Square!',
        content: this._utils.sanitizeFull(`${tmpContent} ...`.substr(0, limit)),
        img: '',
        fullURL: `${this._utils.getBaseURL()}#/${user}/${this.post.id}`
      },
      direction: direction,
      ariaLabel: 'Share on social media'
    });

  }

  readMore(event: MouseEvent) {
    event.stopPropagation();
    this.realPreviewSize = this.originalRawContent.length;
    this.content = this.substr(this.originalRawContent, this.realPreviewSize);

    this.interceptClicks();
  }


  detectYouTubeLinks(links: string[]): string[] {
    const detectedYouTubeIds: string[] = [];
    // Arbitrary length
    const maxIdLength = 15;
    const detectedYouTubeLinks = links.filter((val) => {
      const url = new URL(val);
      const hostname = url.hostname;
      const search = url.search;
      const pathname = url.pathname;
      if (/youtube.com/.test(hostname)) {
        const params = new URLSearchParams(search);
        let v = params.get('v');
        if (v) {
          v = v.substr(0, maxIdLength);
          // Skip duplicates
          if (detectedYouTubeIds.indexOf(v) < 0) {
            detectedYouTubeIds.push(v);
          }
        }
        return true;
      } else if (/youtu.be/.test(hostname)) {
        let path = this._utils.removeInitialSymbol(pathname, '/');
        if (path) {
          path = path.substr(0, maxIdLength);
          // Skip duplicates
           if (detectedYouTubeIds.indexOf(path) < 0) {
            detectedYouTubeIds.push(path);
          }
        }
        return true;
      }
      return false;
    });

    return detectedYouTubeIds;
  }

  _loadContentHelperLoadContent(_postId: string) {
    this.loadingContent = true;
    this.contentSubscription = this._arweave.getDataAsString(_postId).subscribe({
      next: (data: string|Uint8Array) => {
        // this.content = this._utils.sanitize(`${data}`);
        this.originalRawContent = this._utils.sanitizeFull(`${data}`);
        const links = this._utils.getLinks(`${this.originalRawContent}`);
        const detectedLinks = links.map((val) => {
          return val.href;
        });
        
        // Extract youtube links
        const detectedYouTubeIds = this.detectYouTubeLinks(detectedLinks);

        for (const ytId of detectedYouTubeIds) {
          this.substories.push({id: ytId, type: 'youtube'});
        }

        this.content = this.substr(this.originalRawContent, this.maxPreviewSize);


        this.loadingContent = false;
        
        this.interceptClicks();
      },
      error: (error) => {
        this.loadingContent = false;
        console.error('_loadContentHelperLoadContent error', error);
      }
    });
  }

  showStoryMoreTextBtn() {
    return this.originalRawContent.length > this.maxPreviewSize && this.realPreviewSize !== `${this.originalRawContent}`.length;
  }

  substr(s: string, length: number) {
    const ellipsis = length <= this.maxPreviewSize && length < s.length ? '...' : '';
    return (this._utils.sanitize(s.substr(0, length)) + ellipsis);
  }

  loadContent(recurLv = 0) {
    const dataSize = this.post.dataSize ? +(this.post.dataSize) : 0;
    // Read tags and
    // fill substories array
    this.owner = this.post.owner;
    this.postContentType = this.post.dataType ? this.post.dataType : '';
    this.extractTagsFromPost(this.post);
    if (this.postType === 'post' || 
        this.postType === 'reply') { 
      if (dataSize <= this._appSettings.storyMaxSizeBytes && this.validateContentType(this.postContentType, 'text')) {// Load content
        this._loadContentHelperLoadContent(this.post.id);
      } else if (!this.post || this.post.dataSize === undefined) {
        this.contentError = `Transaction is pending ...`;
      } else {
        this.contentError = `Story is too big to be displayed.
          Size limit for text: ${this._appSettings.storyMaxSizeBytes}bytes.
          Story size: ${this.post.dataSize} bytes.`;
      }
    } else if (this.postType === 'repost' && this.repostId !== '' && !recurLv) {
      this.isReposted = true;
      this.loadPostAndThenData(this.repostId, recurLv + 1);
    } else if (this.postType !== 'repost' && this.postType !== '') {
      this.contentError = `Unknown story type 👽 ${this.post.id} - ${this.postType}`;
    }
  }

  interceptClicks() {
    window.setTimeout(() => {
      const aTags = this.contentContainer && this.contentContainer.nativeElement ? 
        this.contentContainer.nativeElement.getElementsByTagName('a') : [];
      for (const anchor of aTags) {
        anchor.addEventListener('click', (event: MouseEvent) => {
          event.stopPropagation();
          event.preventDefault();
          const anchor = <Element>event.target;
          if (anchor.getAttribute('target') === '_self') {
            window.location.href = anchor.getAttribute('href')!;
          } else {
            this.confirmDialog(anchor.getAttribute('href')!);
          }
        });
      }
    }, 400);
  }

  confirmDialog(href: string) {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    // defLang.writing_system
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(
      ConfirmationDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          content: `Do you really want to visit this site? ${href}`,
          closeLabel: 'No',
          confirmLabel: 'Yes, open link in new tab'
        },
        direction: direction
      }
    );

    dialogRef.afterClosed().subscribe((confirm: string) => {
      if (confirm) {
        window.open(href, '_blank');
       
      }
    });
  }


  validateContentType(contentType: string, desiredType: 'image'|'audio'|'video'|'text') {
    return (
      Object.prototype.hasOwnProperty.call(this._appSettings.supportedFiles, desiredType) ?
      this._appSettings.supportedFiles[desiredType].indexOf(contentType) >= 0 :
      false
    );
  }

  getFullImgUrlFromTx(tx: string) {
    return `${this._arweave.baseURL}${tx}`;
  }

  goBack() {
    this._location.back();
  }

}
