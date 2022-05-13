import { Component, OnInit, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UtilsService } from '../../core/utils/utils.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { Subscription } from 'rxjs';
import { FileExplorerService } from '../../core/services/file-explorer.service';
import { ArweaveService } from '../../core/services/arweave.service';

@Component({
  selector: 'app-file-manager-dialog',
  templateUrl: './file-manager-dialog.component.html',
  styleUrls: ['./file-manager-dialog.component.scss']
})
export class FileManagerDialogComponent implements OnInit, OnDestroy {
  supportedFiles: Record<string, string[]> = {
    'image': [
      'image/gif', 'image/png',
      'image/jpeg', 'image/bmp',
      'image/webp'
    ],
    'audio': [
      'audio/midi', 'audio/mpeg',
      'audio/webm', 'audio/ogg',
      'audio/wav'
    ],
    'video': [
      'video/webm', 'video/ogg', 'video/mp4'
    ],
    'text': [
      'text/plain'
    ],
  };
  files: TransactionMetadata[] = [];
  private _loadingFilesSubscription = Subscription.EMPTY;
  private _nextResultsSubscription = Subscription.EMPTY;
  loadingFiles = false;
  loadingMore = false;
  moreResultsAvailable = true;
  @ViewChild('moreResultsCard', { read: ElementRef }) moreResultsCard!: ElementRef;

  constructor(
    private _dialogRef: MatDialogRef<FileManagerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      address: string,
    },
    private _utils: UtilsService,
    private _fileExplorer: FileExplorerService,
    private _arweave: ArweaveService) { }


  ngOnInit(): void {
    const types = this.supportedFiles[this.data.type];
    this.loadingFiles = true;
    const limit = 20;
    this._loadingFilesSubscription = this._fileExplorer.getUserFiles(types, this.data.address, limit).subscribe({
      next: (files) => {
        if (!files || !files.length) {
          this.moreResultsAvailable = false;
        }
        this.files = files;
        this.loadingFiles = false;
      },
      error: (error) => {
        this._utils.message(error, 'error');
        this.loadingFiles = false;
      }
    })
  }

  close(tx: string = '') {
    this._dialogRef.close(tx);
  }

  moreResults() {
    this.loadingMore = true;
    this._nextResultsSubscription = this._fileExplorer.next().subscribe({
      next: (results) => {
        if (!results || !results.length) {
          this.moreResultsAvailable = false;
        }
        this.files.push(...results);
        this.loadingMore = false;
      },
      error: (error) => {
        this.loadingMore = false;
        this._utils.message(error, 'error');
      }
    })
  }

  ngOnDestroy() {
    this._loadingFilesSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
  }


  hasOwnProperty(obj: any, key: string) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  ellipsis(s: string) {
    return this._utils.ellipsis(s);
  }

  getFileUrl(tx: string) {
    return `${this._arweave.baseURL}${tx}`;
  }

  dateFormat(date: string|number|undefined) {
    const d = date ? date : '';
    return this._utils.dateFormat(d);
  }
}
