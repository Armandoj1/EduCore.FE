import { TestBed } from '@angular/core/testing';

import { RegistrarNotasService } from './registrar-notas.service';

describe('RegistrarNotasService', () => {
  let service: RegistrarNotasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrarNotasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
