import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegisterationComponent } from './user-registeration.component';

describe('UserRegisterationComponent', () => {
  let component: UserRegisterationComponent;
  let fixture: ComponentFixture<UserRegisterationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRegisterationComponent]
    });
    fixture = TestBed.createComponent(UserRegisterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
