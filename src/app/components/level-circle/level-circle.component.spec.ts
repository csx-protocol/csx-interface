import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelCircleComponent } from './level-circle.component';

describe('LevelCircleComponent', () => {
  let component: LevelCircleComponent;
  let fixture: ComponentFixture<LevelCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelCircleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
