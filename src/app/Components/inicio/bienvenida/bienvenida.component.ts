import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
  ],
})
export class BienvenidaComponent implements OnInit {
  metricCards = [
    { title: 'Total Estudiantes', value: '1,234', change: '+10% desde el último mes', icon: 'fas fa-users' },
    { title: 'Asistencia Promedio', value: '92%', change: '+2% desde la última semana', icon: 'fas fa-clipboard-list' },
    { title: 'Cursos Activos', value: '56', change: '+3 nuevos cursos este mes', icon: 'fas fa-graduation-cap' },
    { title: 'Próximos Eventos', value: '7', change: 'En los próximos 30 días', icon: 'fas fa-calendar' },
  ];

  recentActivity = [
    { initials: 'MG', name: 'María González', action: 'subió calificaciones para Matemáticas 101', time: 'Hace 1h', color: 'bg-blue-100 text-blue-700' },
    { initials: 'JP', name: 'Juan Pérez', action: 'actualizó el horario de Ciencias', time: 'Hace 2h', color: 'bg-green-100 text-green-700' },
    { initials: 'AR', name: 'Ana Rodriguez', action: 'marcó asistencia para Historia Mundial', time: 'Hace 3h', color: 'bg-purple-100 text-purple-700' },
    { initials: 'CS', name: 'Carlos Sánchez', action: 'creó un nuevo evento: Feria de Ciencias', time: 'Hace 4h', color: 'bg-orange-100 text-orange-700' },
  ];

  constructor() { }

  ngOnInit(): void { }
}