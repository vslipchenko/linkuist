import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PostSubcommentsComponent} from './post-subcomments.component';

describe('PostSubcommentComponent', () => {
  let component: PostSubcommentsComponent;
  let fixture: ComponentFixture<PostSubcommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostSubcommentsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostSubcommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
