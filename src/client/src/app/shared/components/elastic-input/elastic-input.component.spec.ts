import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ElasticInputComponent} from './elastic-input.component';

describe('ElasticInputComponent', () => {
  let component: ElasticInputComponent;
  let fixture: ComponentFixture<ElasticInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElasticInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElasticInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
