import { TestBed } from '@angular/core/testing';

import { ChainEventsService } from './chain-events.service';

describe('ChainEventsService', () => {
  let service: ChainEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChainEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
