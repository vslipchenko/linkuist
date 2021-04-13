import {TestBed} from '@angular/core/testing';
import {UserCanActivateGuard} from './user.guard';

describe('UserCanActivateGuard', () => {
  let guard: UserCanActivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserCanActivateGuard);
  });

  it('should be created', () => {
    void expect(guard).toBeTruthy();
  });
});
