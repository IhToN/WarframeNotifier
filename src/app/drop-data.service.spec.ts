import { TestBed, inject } from '@angular/core/testing';

import { DropDataService } from './drop-data.service';

describe('DropDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DropDataService]
    });
  });

  it('should be created', inject([DropDataService], (service: DropDataService) => {
    expect(service).toBeTruthy();
  }));
});
