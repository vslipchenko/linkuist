import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserPanelStripeComponent} from './user-panel-stripe.component';

describe('UserPanelStripeComponent', () => {
  let component: UserPanelStripeComponent;
  let fixture: ComponentFixture<UserPanelStripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPanelStripeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPanelStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
