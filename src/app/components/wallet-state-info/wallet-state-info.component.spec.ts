import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletStateInfoComponent } from './wallet-state-info.component';

describe('WalletStateInfoComponent', () => {
  let component: WalletStateInfoComponent;
  let fixture: ComponentFixture<WalletStateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletStateInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletStateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
