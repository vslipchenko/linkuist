import {TestBed} from '@angular/core/testing';

import {ResolvedUserService} from './resolved-user.service';

describe('ResolvedUserService', () => {
  let service: ResolvedUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResolvedUserService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
