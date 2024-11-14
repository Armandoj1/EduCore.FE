import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GestionEstudianteComponent } from './gestion-estudiante.component';

describe('GestionEstudianteComponent', () => {
  let component: GestionEstudianteComponent;
  let fixture: ComponentFixture<GestionEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionEstudianteComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal', () => {
    component.openAddStudentModal();
    expect(component.isModalOpen).toBeTruthy();
  });

  it('should close modal', () => {
    component.isModalOpen = true;
    component.closeModal();
    expect(component.isModalOpen).toBeFalsy();
  });

  it('should add student', () => {
    const initialLength = component.students.length;
    component.newStudent = {
      id: '004',
      name: 'Test Student',
      age: 15,
      email: 'test@example.com',
      grade: '9°',
      birthdate: '2008-01-01',
      address: 'Test Address',
      phone: '1234567890'
    };
    component.addStudent();
    expect(component.students.length).toBe(initialLength + 1);
    expect(component.students[component.students.length - 1].name).toBe('Test Student');
  });
});