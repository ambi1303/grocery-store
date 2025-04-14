import { TestBed } from '@angular/core/testing';

import { FakepaymentService } from './fakepayment.service';

describe('FakepaymentService', () => {
  let service: FakepaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FakepaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
