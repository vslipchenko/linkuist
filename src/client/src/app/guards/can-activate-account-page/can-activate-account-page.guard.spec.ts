import { TestBed } from '@angular/core/testing';

import { CanActivateAccountPageGuard } from './can-activate-account-page.guard';

describe('CanActivateAccountPageGuard', () => {
  let guard: CanActivateAccountPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanActivateAccountPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
