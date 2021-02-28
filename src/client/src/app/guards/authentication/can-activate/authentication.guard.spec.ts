import {TestBed} from '@angular/core/testing';
import {AuthenticationCanActivateGuard} from './authentication.guard';

describe('AuthenticationCanActivateGuard', () => {
  let guard: AuthenticationCanActivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthenticationCanActivateGuard);
  });

  it('should be created', () => {
    void expect(guard).toBeTruthy();
  });
});
