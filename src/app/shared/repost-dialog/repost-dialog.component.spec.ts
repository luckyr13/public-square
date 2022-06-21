import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepostDialogComponent } from './repost-dialog.component';

describe('RepostDialogComponent', () => {
  let component: RepostDialogComponent;
  let fixture: ComponentFixture<RepostDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepostDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
