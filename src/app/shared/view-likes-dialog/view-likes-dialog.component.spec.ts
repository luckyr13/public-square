import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLikesDialogComponent } from './view-likes-dialog.component';

describe('ViewLikesDialogComponent', () => {
  let component: ViewLikesDialogComponent;
  let fixture: ComponentFixture<ViewLikesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLikesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLikesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
