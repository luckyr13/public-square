import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposedCreatePostDialogComponent } from './composed-create-post-dialog.component';

describe('ComposedCreatePostDialogComponent', () => {
  let component: ComposedCreatePostDialogComponent;
  let fixture: ComponentFixture<ComposedCreatePostDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComposedCreatePostDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComposedCreatePostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
