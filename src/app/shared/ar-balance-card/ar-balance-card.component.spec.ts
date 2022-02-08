import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArBalanceCardComponent } from './ar-balance-card.component';

describe('ArBalanceCardComponent', () => {
  let component: ArBalanceCardComponent;
  let fixture: ComponentFixture<ArBalanceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArBalanceCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArBalanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
