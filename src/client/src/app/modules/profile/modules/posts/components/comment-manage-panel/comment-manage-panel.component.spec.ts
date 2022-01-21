import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CommentManagePanelComponent} from './comment-manage-panel.component';

describe('CommentManagePanelComponent', () => {
  let component: CommentManagePanelComponent;
  let fixture: ComponentFixture<CommentManagePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentManagePanelComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentManagePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
