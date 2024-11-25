import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { EventosService } from '../../../Services/eventos.service';
import { SharedUserService } from '../../../Services/shared-user.service';

interface Evento {
  titulo: string;
  descripcion: string;
  estado: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
}

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
    { title: 'Total Estudiantes', value: '0', change: 'Cargando...', icon: 'fas fa-users' },
    { title: 'Próximos Eventos', value: '0', change: 'Cargando...', icon: 'fas fa-calendar' },
  ];

  recentEvents: Evento[] = [];

  constructor(
    private eventosService: EventosService,
    private sharedUserService: SharedUserService
  ) { }

  ngOnInit(): void {
    this.loadStudentCount();
    this.loadEvents();
  }

  loadStudentCount(): void {
    this.eventosService.getNumeroEstudiantes().subscribe(
      (response: any) => {
        console.log('Respuesta de getNumeroEstudiantes:', response);
        if (response && response.resultadoConsulta && Array.isArray(response.resultadoConsulta)) {
          const studentCount = response.resultadoConsulta.length;
          this.metricCards[0].value = studentCount.toString();
          this.metricCards[0].change = `Total de estudiantes registrados`;
        } else {
          console.error('La respuesta de getNumeroEstudiantes no tiene la estructura esperada:', response);
          this.metricCards[0].value = 'N/A';
          this.metricCards[0].change = 'Datos no disponibles';
        }
      },
      error => {
        console.error('Error al cargar el número de estudiantes:', error);
        this.metricCards[0].value = 'Error';
        this.metricCards[0].change = 'No se pudo cargar la información';
      }
    );
  }

  loadEvents(): void {
    this.sharedUserService.currentUserName.subscribe(userId => {
      this.eventosService.getEventos(userId).subscribe(
        (response: any) => {
          console.log('Respuesta de getEventos:', response);
          if (response && response.resultadoConsulta && Array.isArray(response.resultadoConsulta)) {
            const eventos = response.resultadoConsulta;
            this.recentEvents = eventos.map((evento: any) => ({
              titulo: evento.titulo || 'Sin título',
              descripcion: evento.descripcion || 'Sin descripción',
              estado: evento.estado || 'Sin estado',
              nombre: evento.nombre || 'Sin tipo',
              fechaInicio: evento.fechaInicio || '',
              fechaFin: evento.fechaFin || ''
            }));
            this.metricCards[1].value = eventos.length.toString();
            this.metricCards[1].change = `Próximos eventos`;
          } else {
            console.error('La respuesta de getEventos no tiene la estructura esperada:', response);
            this.recentEvents = [];
            this.metricCards[1].value = 'N/A';
            this.metricCards[1].change = 'Datos no disponibles';
          }
        },
        error => {
          console.error('Error al cargar los eventos:', error);
          this.metricCards[1].value = 'Error';
          this.metricCards[1].change = 'No se pudo cargar la información';
        }
      );
    });
  }
}

