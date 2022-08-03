import { 
  Component, OnInit, ElementRef, OnDestroy, AfterContentInit,
  ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { CodeMirrorWrapper } from '../../core/classes/codemirror-wrapper';
import { UserInterface } from '@verto/js/dist/common/faces';
import { ArweaveService } from '../../core/services/arweave.service';
import { VertoService } from '../../core/services/verto.service';
import { UserAuthService } from '../../core/services/user-auth.service';
import { PostService } from '../../core/services/post.service';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { UtilsService } from '../../core/utils/utils.service';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import { FileManagerDialogComponent } from '../file-manager-dialog/file-manager-dialog.component'; 
import { UploadFileDialogComponent } from '../upload-file-dialog/upload-file-dialog.component';
import { SubmitPostDialogComponent } from '../submit-post-dialog/submit-post-dialog.component';
import Transaction from 'arweave/web/lib/transaction';
import {TranslateService} from '@ngx-translate/core';
import { Direction } from '@angular/cdk/bidi';


@Component({
  selector: 'app-create-post-card',
  templateUrl: './create-post-card.component.html',
  styleUrls: ['./create-post-card.component.scss']
})
export class CreatePostCardComponent implements OnInit, OnDestroy, AfterContentInit, OnChanges {
  @ViewChild('postMessage', {static: true}) postMessage!: ElementRef;
  loading: boolean = true;
  loadEditorSubscription: Subscription = Subscription.EMPTY;
  codemirrorWrapper: CodeMirrorWrapper;
  loadingData = false;
  profileSubscription: Subscription = Subscription.EMPTY;
  profileImage: string = 'assets/images/blank-profile.jpg';
  nickname: string = '';
  messageContent: string = '';
  contentSubscription: Subscription = Subscription.EMPTY;
  loadingCreatePost = false;
  createPostSubscription: Subscription = Subscription.EMPTY;
  isDarkTheme = false;
  themeSubscription = Subscription.EMPTY;
  @Input('account') account!: string;
  @Output('newStoryEvent') newStoryEvent = new EventEmitter<string>();
  @Output('contentChangeEvent') contentChangeEvent = new EventEmitter<string>();
  @Input('showSubmitButton') showSubmitButton: boolean = true;
  substories: {id: string, content: string, type: 'text'|'image', arrId: number}[] = [];
  unsignedTxSubscription = Subscription.EMPTY;
  @Input('emitContent') emitContent: boolean = false;
  
  constructor(
    private _verto: VertoService,
    private _arweave: ArweaveService,
    private _auth: UserAuthService,
    private _post: PostService,
    private _userSettings: UserSettingsService,
    private _utils: UtilsService,
    private _dialog: MatDialog,
    private _translate: TranslateService) {
    this.codemirrorWrapper = new CodeMirrorWrapper();
  }

  ngOnInit(): void {
    this.contentSubscription = this.codemirrorWrapper.contentStream.subscribe((content) => {
      this.messageContent = content;
      this.contentChangeEvent.emit(content);
    });
    this.isDarkTheme = this._userSettings.isDarkTheme(this._userSettings.getDefaultTheme());
    this.themeSubscription = this._userSettings.currentThemeStream.subscribe((theme) => {
      this.isDarkTheme = this._userSettings.isDarkTheme(theme);
    });
  }

  loadVertoProfile(account: string) {
    this.loadingData = true;
    this.profileImage = 'assets/images/blank-profile.jpg';
    this.nickname = '';
    account = account.trim();
    
    this.profileSubscription = this._verto.getProfile(account).subscribe({
        next: (profile: UserInterface|undefined) => {
          if (profile) {
            if (profile.image) {
              this.profileImage = `${this._arweave.baseURL}${profile.image}`;
            }
            if (profile.username) {
              this.nickname = profile.username;
              this._translate.get('GENERAL.CREATE_STORY.TXTAREA_LABEL', {value: this.nickname}).subscribe((res: string) => {
                this.codemirrorWrapper.updatePlaceholder(res);
              });
            } else {
              this._translate.get(
                'GENERAL.CREATE_STORY.TXTAREA_LABEL',
                { value: this._utils.ellipsis(account) }
              ).subscribe((res: string) => {
                this.codemirrorWrapper.updatePlaceholder(res);
              });
            }
          } else {
            this._translate.get(
              'GENERAL.CREATE_STORY.TXTAREA_LABEL',
              { value: this._utils.ellipsis(account) }
            ).subscribe((res: string) => {
              this.codemirrorWrapper.updatePlaceholder(res);
            });
          }
          this.loadingData = false;
        },
        error: (error) => {
          this.loadingData = false;
          this._utils.message(error, 'error');
        }
      });
  }

  ngAfterContentInit() {
    this.loading = true;
    this.loadEditorSubscription = this.codemirrorWrapper.init(
      this.postMessage.nativeElement
    ).subscribe({
      next: (res) => {
        // Done
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this._utils.message(error, 'error');
      },
      complete: () => {
        this.loadVertoProfile(this.account);
      }
    });
  }

  ngOnDestroy() {
    this.loadEditorSubscription.unsubscribe();
    this.profileSubscription.unsubscribe();
    this.contentSubscription.unsubscribe();
    this.createPostSubscription.unsubscribe();
    this.codemirrorWrapper.destroy();
    this.unsignedTxSubscription.unsubscribe();
  }

  submitSubstory() {
    this.loadingCreatePost = true;
    this.newStoryEvent.emit(this.messageContent);
    this.substories = [];
  }

  submit() {
    if (this.emitContent) {
      this.submitSubstory();
      return;
    }
    this.loadingCreatePost = true;
    this.codemirrorWrapper.editable(false);

    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(
      SubmitPostDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          address: this.account,
          substories: this.substories,
          mainStory: this.messageContent
        },
        direction: direction
      }
    );

    dialogRef.afterClosed().subscribe((mainTx: string) => {
      if (mainTx) {
        this.loadingCreatePost = false;
        this.codemirrorWrapper.resetEditor();
        this.codemirrorWrapper.editable(true);
        this._utils.message('Success!', 'success');
        this.newStoryEvent.emit(mainTx);
        this.substories = [];
      } else {
        this.loadingCreatePost = false;
        this.codemirrorWrapper.editable(true);
      }
    });

    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['account'].previousValue != this.account) {
      this.loadVertoProfile(changes['account'].currentValue);
    }
  }

  emojiSelected(s: string) {
    if (s) {
      this.codemirrorWrapper.insertText(s);
    }
  }

  getImgUrlFromTx(tx: string) {
    return `${this._arweave.baseURL}${tx}`;
  }

  getSubstoriesFiltered(filter: string) {
    return this.substories.filter((s) => {
      return s.type === filter;
    });
  }

  deleteSubstory(arrId: number) {
    const i = this.substories.findIndex((s) => {
      return s.arrId === arrId;
    });

    if (i === undefined) {
      return;
    }

    this.substories.splice(i, 1);
  }


}
