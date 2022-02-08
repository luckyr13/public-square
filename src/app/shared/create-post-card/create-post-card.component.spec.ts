import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostCardComponent } from './create-post-card.component';

describe('CreatePostCardComponent', () => {
  let component: CreatePostCardComponent;
  let fixture: ComponentFixture<CreatePostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePostCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
