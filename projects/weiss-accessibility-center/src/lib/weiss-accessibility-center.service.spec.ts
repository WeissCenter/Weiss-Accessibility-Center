import { TestBed } from '@angular/core/testing';

import { WeissAccessibilityCenterService } from './weiss-accessibility-center.service';

describe('WeissAccessibilityCenterService', () => {
  let service: WeissAccessibilityCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeissAccessibilityCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
