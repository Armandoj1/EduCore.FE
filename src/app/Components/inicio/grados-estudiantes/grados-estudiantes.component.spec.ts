import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradosEstudiantesComponent } from './grados-estudiantes.component';

describe('GradosEstudiantesComponent', () => {
  let component: GradosEstudiantesComponent;
  let fixture: ComponentFixture<GradosEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GradosEstudiantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradosEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
