import { TestBed } from '@angular/core/testing';

import { InitPlatformAuthGuard } from './init-platform-auth.guard';

describe('InitPlatformAuthGuard', () => {
  let guard: InitPlatformAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InitPlatformAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
