import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileBannerComponent } from './edit-profile-banner.component';

describe('EditProfileBannerComponent', () => {
  let component: EditProfileBannerComponent;
  let fixture: ComponentFixture<EditProfileBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProfileBannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfileBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
