import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDispatchDialogComponent } from './confirmation-dispatch-dialog.component';

describe('ConfirmationDispatchDialogComponent', () => {
  let component: ConfirmationDispatchDialogComponent;
  let fixture: ComponentFixture<ConfirmationDispatchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationDispatchDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationDispatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
