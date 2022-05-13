import { Injectable } from '@angular/core';

export interface ThemeObject {
  id: string,
  label: string,
  dark: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ThemesService {
  public themes: Record<string, ThemeObject> = {
    'dark-blue-gray-theme': {
      id: 'dark-blue-gray-theme',
      label: 'Dark Blue',
      dark: true
    },
    'light-blue-theme': {
      id: 'light-blue-theme',
      label: 'Light Blue',
      dark: false
    },
    'dark-theme': {
      id: 'dark-theme',
      label: 'Dark',
      dark: true
    },
    'light-theme': {
      id: 'light-theme',
      label: 'Light',
      dark: false
    },
    'dark-pink-theme': {
      id: 'dark-pink-theme',
      label: 'Dark Pink',
      dark: true
    },
    'light-pink-theme': {
      id: 'light-pink-theme',
      label: 'Light Pink',
      dark: false
    },
    'dark-deep-purple-theme': {
      id: 'dark-deep-purple-theme',
      label: 'Deep Purple',
      dark: true
    }
  };

  constructor() { }
}
