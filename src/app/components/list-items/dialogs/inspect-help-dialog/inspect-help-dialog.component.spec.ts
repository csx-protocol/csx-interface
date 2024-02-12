import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectHelpDialogComponent } from './inspect-help-dialog.component';

describe('InspectHelpDialogComponent', () => {
  let component: InspectHelpDialogComponent;
  let fixture: ComponentFixture<InspectHelpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectHelpDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
