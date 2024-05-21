import { TestBed } from '@angular/core/testing';

import { AutoSucursalService } from './auto-sucursal.service';

describe('AutoSucursalService', () => {
  let service: AutoSucursalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoSucursalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
