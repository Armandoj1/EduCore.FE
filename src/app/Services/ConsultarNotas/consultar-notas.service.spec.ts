import { TestBed } from '@angular/core/testing';

import { ConsultarNotasService } from './consultar-notas.service';

describe('ConsultarNotasService', () => {
  let service: ConsultarNotasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultarNotasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
