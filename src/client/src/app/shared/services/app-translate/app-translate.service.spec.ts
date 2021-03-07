import {TestBed} from '@angular/core/testing';

import {AppTranslateService} from './app-translate.service';

describe('AppTranslateService', () => {
  let service: AppTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppTranslateService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
