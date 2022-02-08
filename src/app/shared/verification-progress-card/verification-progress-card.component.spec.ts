import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationProgressCardComponent } from './verification-progress-card.component';

describe('VerificationProgressCardComponent', () => {
  let component: VerificationProgressCardComponent;
  let fixture: ComponentFixture<VerificationProgressCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationProgressCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationProgressCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
