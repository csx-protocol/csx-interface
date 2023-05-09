import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCodeComponent } from './my-code.component';

describe('MyCodeComponent', () => {
  let component: MyCodeComponent;
  let fixture: ComponentFixture<MyCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
