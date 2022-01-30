import {TestBed} from '@angular/core/testing';

import {PostReplyService} from './post-reply.service';

describe('PostReplyService', () => {
  let service: PostReplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostReplyService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
