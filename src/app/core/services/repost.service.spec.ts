import { TestBed } from '@angular/core/testing';

import { RepostService } from './repost.service';

describe('RepostService', () => {
  let service: RepostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
