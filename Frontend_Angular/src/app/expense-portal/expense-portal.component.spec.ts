import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensePortalComponent } from './expense-portal.component';

describe('ExpensePortalComponent', () => {
  let component: ExpensePortalComponent;
  let fixture: ComponentFixture<ExpensePortalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpensePortalComponent]
    });
    fixture = TestBed.createComponent(ExpensePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
