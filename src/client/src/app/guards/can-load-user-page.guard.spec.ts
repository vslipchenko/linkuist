import { TestBed } from '@angular/core/testing';

import { CanLoadUserPageGuard } from './can-load-user-page.guard';

describe('CanLoadUserPageGuard', () => {
  let guard: CanLoadUserPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanLoadUserPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
