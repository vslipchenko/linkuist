import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PostRepliesComponent} from './post-replies.component';

describe('PostReplyComponent', () => {
  let component: PostRepliesComponent;
  let fixture: ComponentFixture<PostRepliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostRepliesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostRepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
