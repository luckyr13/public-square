import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileNotFoundComponent } from './profile-not-found.component';

describe('ProfileNotFoundComponent', () => {
  let component: ProfileNotFoundComponent;
  let fixture: ComponentFixture<ProfileNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
