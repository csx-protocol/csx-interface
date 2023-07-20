import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintEscrowComponent } from './mint-escrow.component';

describe('MintEscrowComponent', () => {
  let component: MintEscrowComponent;
  let fixture: ComponentFixture<MintEscrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintEscrowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintEscrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
