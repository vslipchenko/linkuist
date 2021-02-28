import {TestBed} from '@angular/core/testing';

import {NoteService} from './note.service';

describe('NoteService', () => {
  let service: NoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
