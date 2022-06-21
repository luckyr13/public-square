import { TestBed } from '@angular/core/testing';

import { ReplyService } from './reply.service';

describe('ReplyService', () => {
  let service: ReplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
