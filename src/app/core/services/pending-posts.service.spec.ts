import { TestBed } from '@angular/core/testing';

import { PendingPostsService } from './pending-posts.service';

describe('PendingPostsService', () => {
  let service: PendingPostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingPostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
