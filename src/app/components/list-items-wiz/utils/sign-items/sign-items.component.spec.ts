import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignItemsComponent } from './sign-items.component';

describe('SignItemsComponent', () => {
  let component: SignItemsComponent;
  let fixture: ComponentFixture<SignItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
