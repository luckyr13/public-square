import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPostDialogComponent } from './submit-post-dialog.component';

describe('SubmitPostDialogComponent', () => {
  let component: SubmitPostDialogComponent;
  let fixture: ComponentFixture<SubmitPostDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitPostDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
