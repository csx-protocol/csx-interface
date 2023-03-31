import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyListedItemsComponent } from './recently-listed-items.component';

describe('RecentlyListedItemsComponent', () => {
  let component: RecentlyListedItemsComponent;
  let fixture: ComponentFixture<RecentlyListedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlyListedItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyListedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
