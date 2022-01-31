import {TestBed} from '@angular/core/testing';

import {PostCommentStatsService} from './post-comment-stats.service';

describe('PostCommentStatsService', () => {
  let service: PostCommentStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostCommentStatsService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
