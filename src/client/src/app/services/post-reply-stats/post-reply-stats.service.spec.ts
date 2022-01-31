import {TestBed} from '@angular/core/testing';

import {PostReplyStatsService} from './post-reply-stats.service';

describe('PostReplyStatsService', () => {
  let service: PostReplyStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostReplyStatsService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
