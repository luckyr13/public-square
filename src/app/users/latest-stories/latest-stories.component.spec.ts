import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestStoriesComponent } from './latest-stories.component';

describe('LatestStoriesComponent', () => {
  let component: LatestStoriesComponent;
  let fixture: ComponentFixture<LatestStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestStoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
