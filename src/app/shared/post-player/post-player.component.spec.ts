import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPlayerComponent } from './post-player.component';

describe('PostPlayerComponent', () => {
  let component: PostPlayerComponent;
  let fixture: ComponentFixture<PostPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
