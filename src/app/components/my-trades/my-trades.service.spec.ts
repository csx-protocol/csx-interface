import { TestBed } from '@angular/core/testing';

import { MyTradesService } from './my-trades.service';

describe('MyTradesService', () => {
  let service: MyTradesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyTradesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a totalUserTrades property', () => {
    expect(service.totalUserTrades).toBeDefined();
  });

  // should have loaded the amount according to step length after init
  it('should have loaded the amount according to step length after init', () => {
    expect(service.userUIs.length).toEqual(service.step);
  });
});
