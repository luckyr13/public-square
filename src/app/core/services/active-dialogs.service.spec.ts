import { TestBed } from '@angular/core/testing';

import { ActiveDialogsService } from './active-dialogs.service';

describe('ActiveDialogsService', () => {
  let service: ActiveDialogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveDialogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
