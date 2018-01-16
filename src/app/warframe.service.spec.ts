import { TestBed, inject } from '@angular/core/testing';

import { WarframeService } from './warframe.service';

describe('WarframeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WarframeService]
    });
  });

  it('should be created', inject([WarframeService], (service: WarframeService) => {
    expect(service).toBeTruthy();
  }));
});
