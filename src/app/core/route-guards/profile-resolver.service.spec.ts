import { TestBed } from '@angular/core/testing';

import { ProfileResolverService } from './profile-resolver.service';

describe('ProfileResolverService', () => {
  let service: ProfileResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
