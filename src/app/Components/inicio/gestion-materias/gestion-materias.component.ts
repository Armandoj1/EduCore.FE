import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface Subject {
  id: string;
  name: string;
}

@Component({
  selector: 'app-gestion-materias',
  templateUrl: './gestion-materias.component.html',
  styleUrls: ['./gestion-materias.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('slideInFromLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
    trigger('slideInFromRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
    trigger('slideInFromTop', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
    trigger('slideInFromBottom', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0 }),
          stagger('50ms', [
            animate('300ms ease-out', style({ opacity: 1 })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class GestionMateriasComponent implements OnInit {
  subjects: Subject[] = [];
  currentSubject: Subject = this.getEmptySubject();
  isEditing = false;
  searchTerm = '';

  constructor() { }

  ngOnInit(): void {
    // Aquí podrías cargar las materias desde un servicio
  }

  getEmptySubject(): Subject {
    return {
      id: '',
      name: '',
    };
  }

  saveSubject(): void {
    if (this.isEditing) {
      const index = this.subjects.findIndex(s => s.id === this.currentSubject.id);
      if (index !== -1) {
        this.subjects[index] = { ...this.currentSubject };
      }
    } else {
      this.subjects.push({ ...this.currentSubject });
    }
    this.currentSubject = this.getEmptySubject();
    this.isEditing = false;
  }

  editSubject(subject: Subject): void {
    this.currentSubject = { ...subject };
    this.isEditing = true;
  }

  deleteSubject(subject: Subject): void {
    this.subjects = this.subjects.filter(s => s.id !== subject.id);
  }

  cancelEdit(): void {
    this.currentSubject = this.getEmptySubject();
    this.isEditing = false;
  }

  searchSubject(): void {
    // Implementar la lógica de búsqueda aquí
  }
}