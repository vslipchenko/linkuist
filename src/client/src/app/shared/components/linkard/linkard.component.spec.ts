import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LinkardComponent} from './linkard.component';

describe('LinkardComponent', () => {
  let component: LinkardComponent;
  let fixture: ComponentFixture<LinkardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
