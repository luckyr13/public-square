import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as linkify from 'linkifyjs';
import linkifyStr from 'linkify-string';
import 'linkify-plugin-hashtag';
import 'linkify-plugin-mention';
import DOMPurify from 'dompurify';
import { Observable, from } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
   // allowed URI schemes
  allowlist = ['https', 'http'];
  // build fitting regex
  regex = RegExp('^(' + this.allowlist.join('|') + '):', 'gim');
  // Options for linkify
  options = {};

  constructor(
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer) {
    const _this = this;

    this.options = {
      defaultProtocol: 'https',
      target: (href: string, type: string) => {
        if (type === 'mention' || type === 'hashtag') {
          return '_self';
        }
        return '_blank';
      },
      formatHref: {
        hashtag: (href: string) => this.getBaseURL() + '#/search/' + href.substr(1),
        mention: (href: string) => this.getBaseURL() + '#/' + href.substr(1)
      }
    }

    // Add a hook to enforce URI scheme allow-list
    DOMPurify.addHook('afterSanitizeAttributes', function(node) {
      // build an anchor to map URLs to
      var anchor = document.createElement('a');

      // check all href attributes for validity
      if (node.hasAttribute('href')) {
        anchor.href = node.getAttribute('href')!;
        if (anchor.protocol && !anchor.protocol.match(_this.regex)) {
          node.removeAttribute('href');
        }
      }
      // check all action attributes for validity
      if (node.hasAttribute('action')) {
        anchor.href = node.getAttribute('action')!;
        if (anchor.protocol && !anchor.protocol.match(_this.regex)) {
          node.removeAttribute('action');
        }
      }
      // check all xlink:href attributes for validity
      if (node.hasAttribute('xlink:href')) {
        anchor.href = node.getAttribute('xlink:href')!;
        if (anchor.protocol && !anchor.protocol.match(_this.regex)) {
          node.removeAttribute('xlink:href');
        }
      }
    });
  }


  /*
  *  Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

  ellipsis(s: string) {
    const minLength = 12;
    const sliceLength = 5;

    if (!s || typeof(s) !== 'string') {
      return '';
    }

    return s && s.length < minLength ? s : `${s.substring(0, sliceLength)}...${s.substring(s.length - sliceLength, s.length)}`;
  }

  getLinks(s: string) {
    const sanitizedContent = this.sanitizeFull(s);
    const links = linkify.find(sanitizedContent, 'url');
    return links;
  }

  getLinkHashtags(s: string) {
    const sanitizedContent = this.sanitizeFull(s);
    const links = linkify.find(sanitizedContent, 'hashtag');
    return links;
  }

  getLinkMentions(s: string) {
    const sanitizedContent = this.sanitizeFull(s);
    const links = linkify.find(sanitizedContent, 'mention');
    return links;
  }

  sanitize(s: string): string {
    const sanitizedContent = DOMPurify.sanitize(s.trim(), {ALLOWED_TAGS: []});
    const htmlWithLinks = linkifyStr(sanitizedContent, this.options);
    const htmlWithBreakLines = htmlWithLinks.replace(/\n|\r\n/g, '<br>')
    return DOMPurify.sanitize(htmlWithBreakLines, {ALLOWED_TAGS: ['a', 'br'], ALLOWED_ATTR: ['target', 'href']});
  }

  sanitizeFull(s: string): string {
    const sanitizedContent = DOMPurify.sanitize(s.trim(), {ALLOWED_TAGS: []});
    return sanitizedContent;
  }

  dateFormat(d: number|string){
    if (!d) {
      return '';
    }
    const prev = new Date(+d * 1000);
    const current = new Date();
    const millisecondsEllapsed = current.getTime() - prev.getTime(); 
    const seconds = Math.floor(millisecondsEllapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    if (days) {
      const month = months[prev.getMonth()];
      const date = prev.getDate();
      const year = prev.getFullYear();
      const currentYear = current.getFullYear();
      if (currentYear === year) {
        return `${month} ${date}`;
      }
      return `${month} ${date}, ${year}`;
    } else if (hours) {
      return `${hours}h`;
    } else if (minutes) {
      return `${minutes}m`;
    } else if (seconds) {
      return `${seconds}s`;
    }


    return ``;
  }


  getBaseURL() {
    const full = `${window.location.href}`;
    const urlComponents = full.split('#');
    const baseURL = urlComponents && urlComponents.length ? urlComponents[0] : window.location.origin;

    return baseURL;
  }

  /*
  *  https://angular.io/guide/security#sanitization-and-security-contexts
  */
  youtubeVideoURLSecure(id: string) {
    // Appending an ID to a YouTube URL is safe.
    // Always make sure to construct SafeValue objects as
    // close as possible to the input data so
    // that it's easier to check if the value is safe.
    id = this.sanitizeFull(id);
    const youtubeUrl = `https://www.youtube.com/embed/${id}`;
    
    const sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(youtubeUrl);
    return sanitizedUrl;
  }

  youtubeVideoURL(id: string) {
    id = this.sanitizeFull(id);
    const youtubeUrl = `https://www.youtube.com/embed/${id}`;
    return youtubeUrl;
  }

  removeInitialSymbol(hashtag: string, symbol: string = '#') {
    const hasht = hashtag.length && (hashtag[0] === symbol) ?
      hashtag.substr(1, hashtag.length) :
      hashtag;
    return hasht;
  }

}
