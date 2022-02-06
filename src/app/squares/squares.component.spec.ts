import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquaresComponent } from './squares.component';

describe('SquaresComponent', () => {
  let component: SquaresComponent;
  let fixture: ComponentFixture<SquaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquaresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
