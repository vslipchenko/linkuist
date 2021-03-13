import {TestBed} from '@angular/core/testing';

import {LinkardService} from './linkard.service';

describe('LinkardService', () => {
  let service: LinkardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkardService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
