import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRepostsDialogComponent } from './view-reposts-dialog.component';

describe('ViewRepostsDialogComponent', () => {
  let component: ViewRepostsDialogComponent;
  let fixture: ComponentFixture<ViewRepostsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRepostsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRepostsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
