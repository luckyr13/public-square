import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryPlayerSubstoryComponent } from './story-player-substory.component';

describe('StoryPlayerSubstoryComponent', () => {
  let component: StoryPlayerSubstoryComponent;
  let fixture: ComponentFixture<StoryPlayerSubstoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryPlayerSubstoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryPlayerSubstoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
