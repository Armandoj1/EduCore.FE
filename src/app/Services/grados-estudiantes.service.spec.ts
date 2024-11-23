import { TestBed } from '@angular/core/testing';

import { GradosEstudiantesService } from './grados-estudiantes.service';

describe('GradosEstudiantesService', () => {
  let service: GradosEstudiantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradosEstudiantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
