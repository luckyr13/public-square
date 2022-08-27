import { TestBed } from '@angular/core/testing';

import { UsernameValidatorService } from './username-validator.service';

describe('UsernameValidatorService', () => {
  let service: UsernameValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsernameValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
