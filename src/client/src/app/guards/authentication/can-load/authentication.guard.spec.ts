import {TestBed} from '@angular/core/testing';
import {AuthenticationCanLoadGuard} from './authentication.guard';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationCanLoadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthenticationCanLoadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
