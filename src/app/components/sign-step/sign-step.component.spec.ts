import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignStepComponent } from './sign-step.component';

describe('SignStepComponent', () => {
  let component: SignStepComponent;
  let fixture: ComponentFixture<SignStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
