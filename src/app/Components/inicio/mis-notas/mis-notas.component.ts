import { Component, OnInit } from '@angular/core';
import { ConsultarNotasService, ApiResponse } from '../../../Services/ConsultarNotas/consultar-notas.service';
import { SharedUserService, User } from '../../../Services/shared-user.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface Nota {
  nombreMateria: string;
  periodo1: number;
  periodo2: number;
  periodo3: number;
  periodo4: number;
}

@Component({
  selector: 'app-mis-notas',
  templateUrl: './mis-notas.component.html',
  styleUrls: ['./mis-notas.component.css'],
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
export class MisNotasComponent implements OnInit {
  notas: Nota[] = [];
  currentUser: User | null = null;
  errorMessage: string | null = null;

  constructor(
    private consultarNotasService: ConsultarNotasService,
    private sharedUserService: SharedUserService
  ) { }

  ngOnInit(): void {
    this.sharedUserService.currentUserData.subscribe(user => {
      this.currentUser = user;
      if (user) {
        console.log('Usuario actual:', user);
        this.consultarNotas(user.usuario);
      }
    });
  }

  consultarNotas(estudianteCC: string): void {
    console.log('Consultando notas para el estudiante:', estudianteCC);
    this.consultarNotasService.consultarNotasEstudiantes(estudianteCC).subscribe(
      (response: ApiResponse) => {
        console.log('Respuesta de notas:', response);
        if (response && response.resultadoConsulta) {
          this.notas = response.resultadoConsulta as Nota[];
          console.log('Notas consultadas:', this.notas);
          if (this.notas.length === 0) {
            this.errorMessage = "No se encontraron calificaciones para este estudiante.";
          } else {
            this.errorMessage = null;
          }
        }
      },
      (error) => {
        console.error('Error al consultar notas:', error);
        this.errorMessage = "Ocurrió un error al consultar las notas. Por favor, intente de nuevo.";
      }
    );
  }
}

