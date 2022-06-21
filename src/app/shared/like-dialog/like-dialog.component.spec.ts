import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikeDialogComponent } from './like-dialog.component';

describe('LikeDialogComponent', () => {
  let component: LikeDialogComponent;
  let fixture: ComponentFixture<LikeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
