import { Component } from '@angular/core';

interface Student {
  id: string;
  name: string;
  age: number;
  email: string;
  grade: string;
  birthdate: string;
  address: string;
  phone: string;
}

@Component({
  selector: 'app-gestion-estudiante',
  templateUrl: './gestion-estudiante.component.html',
  styleUrls: ['./gestion-estudiante.component.css']
})
export class GestionEstudianteComponent {
  students: Student[] = [
    { id: '001', name: 'Ana Garcia', age: 18, email: 'ana@example.com', grade: '11°', birthdate: '', address: '', phone: '' },
    { id: '002', name: 'Carlos Rodriguez', age: 17, email: 'carlos@example.com', grade: '10°', birthdate: '', address: '', phone: '' },
    { id: '003', name: 'María López', age: 16, email: 'maria@example.com', grade: '9°', birthdate: '', address: '', phone: '' },
  ];

  newStudent: Student = {
    id: '',
    name: '',
    age: 0,
    email: '',
    grade: '',
    birthdate: '',
    address: '',
    phone: ''
  };

  grades: string[] = ['9°', '10°', '11°'];

  isModalOpen: boolean = false;

  openAddStudentModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addStudent() {
    // Aquí iría la lógica para agregar el estudiante a la lista
    this.students.push({...this.newStudent});
    this.closeModal();
    this.newStudent = {
      id: '',
      name: '',
      age: 0,
      email: '',
      grade: '',
      birthdate: '',
      address: '',
      phone: ''
    };
  }
}