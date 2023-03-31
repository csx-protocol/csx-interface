import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatBarComponent } from './float-bar.component';

describe('ProgressBarComponent', () => {
  let component: FloatBarComponent;
  let fixture: ComponentFixture<FloatBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
