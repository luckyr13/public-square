import { Injectable } from '@angular/core';

export interface LanguageObj {
  code: string,
  native_name: string,
  writing_system: string,
  iso_name: string
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public langs: Record<string, LanguageObj> = {
    "en": {
      "code": "en",
      "iso_name": "English",
      "native_name": "English",
      "writing_system": "LTR"
    },
    "es": {
      "code": "es",
      "iso_name": "Spanish",
      "native_name": "Español",
      "writing_system": "LTR"
    },
    "de": {
      "code": "de",
      "iso_name": "German",
      "native_name": "Deutsch",
      "writing_system": "LTR"
    },
    "hi": {
      "code": "hi",
      "iso_name": "Hindi",
      "native_name": "हिन्दी, हिंदी",
      "writing_system": "LTR"
    },
    "ar": {
      "code": "ar",
      "iso_name": "Arabic",
      "native_name": "العربية",
      "writing_system": "RTL"
    },
    "he": {
      "code": "he",
      "iso_name": "Hebrew",
      "native_name": "עברית",
      "writing_system": "RTL"
    },
    "hu": {
      "code": "hu",
      "iso_name": "Hungarian",
      "native_name": "magyar",
      "writing_system": "LTR"
    },
    "ga": {
      "code": "ga",
      "iso_name": "Irish",
      "native_name": "Gaeilge",
      "writing_system": "LTR"
    },
    "zh": {
      "code": "zh",
      "iso_name": "Chinese",
      "native_name": "中文",
      "writing_system": "LTR"
    },
    "id": {
      "code": "id",
      "iso_name": "Indonesian",
      "native_name": "Bahasa Indonesia",
      "writing_system": "LTR"
    },
    "ko": {
      "code": "ko",
      "iso_name": "Korean",
      "native_name": "한국어",
      "writing_system": "LTR"
    }
  };

  getLangObject(lang: string): LanguageObj|null {
    if (Object.prototype.hasOwnProperty.call(this.langs, lang)) {
      return this.langs[lang];
    }
    return null;
  }

  constructor() { }
}
