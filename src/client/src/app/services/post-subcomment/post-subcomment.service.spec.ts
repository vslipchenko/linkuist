import {TestBed} from '@angular/core/testing';

import {PostSubcommentService} from './post-subcomment.service';

describe('PostSubcommentService', () => {
  let service: PostSubcommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostSubcommentService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
