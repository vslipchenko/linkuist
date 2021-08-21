import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LengthCircleComponent} from './length-circle.component';

describe('LengthCircleComponent', () => {
  let component: LengthCircleComponent;
  let fixture: ComponentFixture<LengthCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LengthCircleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LengthCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
