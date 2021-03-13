import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {LinkardsComponent} from './linkards.component';

describe('LinkardsComponent', () => {
  let component: LinkardsComponent;
  let fixture: ComponentFixture<LinkardsComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [LinkardsComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
