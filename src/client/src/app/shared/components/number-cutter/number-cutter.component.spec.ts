import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NumberCutterComponent} from './number-cutter.component';

describe('NumberCutterComponent', () => {
  let component: NumberCutterComponent;
  let fixture: ComponentFixture<NumberCutterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberCutterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberCutterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
