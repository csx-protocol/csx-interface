import { TestBed } from '@angular/core/testing';

import { CsgoItemsService } from './csgo-items.service';

describe('CsgoItemsService', () => {
  let service: CsgoItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsgoItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
