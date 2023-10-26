import { TestBed } from '@angular/core/testing';

import { ActionCardService } from './action-card.service';

describe('ActionCardService', () => {
  let service: ActionCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
