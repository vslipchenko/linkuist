import {TestBed} from '@angular/core/testing';
import {UserCanLoadGuard} from './user.guard';

describe('UserCanLoadGuard', () => {
  let guard: UserCanLoadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserCanLoadGuard);
  });

  it('should be created', () => {
    void expect(guard).toBeTruthy();
  });
});
