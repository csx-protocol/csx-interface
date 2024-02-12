import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemsWizComponent } from './list-items-wiz.component';

describe('ListItemsWizComponent', () => {
  let component: ListItemsWizComponent;
  let fixture: ComponentFixture<ListItemsWizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListItemsWizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListItemsWizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
