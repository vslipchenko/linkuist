import {TestBed} from '@angular/core/testing';

import {PostStatsService} from './post-stats.service';

describe('PostStatsService', () => {
  let service: PostStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostStatsService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
