import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventosService } from '../../../Services/eventos.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { SharedUserService, User } from '../../../Services/shared-user.service';
import { AuthService } from '../../../Services/auth.service';

interface Evento {
  eventoID?: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  gradoID?: number | null;
  estado?: string;
  usuarioCreadorID: string;
  tipoEventoId?: number;
  nombre?: string;
  canEditDelete?: boolean;
}

interface Grado {
  gradoID: number;
  nombreGrado: string;
}

interface TipoEvento {
  tipoEventoID: number;
  nombre: string;
}

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ])
  ]
})
export class EventosComponent implements OnInit, OnDestroy {
  eventos: Evento[] = [];
  grados: Grado[] = [];
  tiposEventos: TipoEvento[] = [];
  showModal = false;
  isEditing = false;
  currentEvento: Evento = {
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    usuarioCreadorID: '',
    tipoEventoId: undefined,
    gradoID: null
  };
  private userId: string = '';
  private userRole: string = '';
  private currentUser: User | null = null;
  private userSubscription: Subscription | null = null;

  constructor(
    private eventosService: EventosService,
    private sharedUserService: SharedUserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.sharedUserService.currentUserData.pipe(
      tap(user => {
        this.currentUser = user;
        if (user) {
          this.userId = user.usuario;
          this.userRole = user.nombreRol;
          console.log('Usuario actual:', this.userId, 'Rol:', this.userRole);
        } else {
          console.log('No hay usuario actual');
          this.userId = '';
          this.userRole = '';
        }
      }),
      switchMap(user => user ? this.loadEventos() : of(null)),
      catchError(error => {
        console.error('Error al cargar eventos:', error);
        return of(null);
      })
    ).subscribe(
      (response: any) => {
        if (response && response.resultadoConsulta) {
          console.log('Datos de eventos recibidos:', response);
          this.eventos = (response.resultadoConsulta || []).map((evento: Evento) => ({
            ...evento,
            canEditDelete: evento.usuarioCreadorID === this.userId
          }));
        } else {
          this.eventos = [];
        }
      }
    );

    this.loadGrados();
    this.loadTiposEventos();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadEventos(): Observable<any> {
    return this.eventosService.getEventos(this.userId).pipe(
      tap(response => {
        if (response && response.resultadoConsulta) {
          this.eventos = (response.resultadoConsulta || []).map((evento: Evento) => ({
            ...evento,
            canEditDelete: evento.usuarioCreadorID === this.userId
          }));
          this.logEventosLoaded();
        } else {
          this.eventos = [];
        }
      }),
      catchError(error => {
        console.error('Error al cargar eventos:', error);
        return of(null);
      })
    );
  }

  loadGrados(): void {
    this.eventosService.getListaGrados().subscribe(
      (response: any) => {
        this.grados = response.resultadoConsulta || [];
        console.log('Grados cargados:', this.grados);
      },
      error => console.error('Error al cargar grados:', error)
    );
  }

  loadTiposEventos(): void {
    this.eventosService.getListaTiposEventos().subscribe(
      (response: any) => {
        this.tiposEventos = response.resultadoConsulta || [];
        console.log('Tipos de eventos cargados:', this.tiposEventos);
      },
      error => console.error('Error al cargar tipos de eventos:', error)
    );
  }

  canAddEvent(): boolean {
    return this.userRole !== 'Estudiante';
  }

  openModal(evento?: Evento): void {
    console.log('Intentando abrir modal. Rol actual:', this.userRole);
    if (!this.canAddEvent() && !evento) {
      console.log('Los estudiantes no pueden agregar eventos');
      return;
    }
    if (evento && evento.usuarioCreadorID !== this.userId) {
      console.log('No tienes permiso para editar este evento');
      return;
    }
    this.showModal = true;
    this.isEditing = !!evento;
    if (evento) {
      this.currentEvento = { 
        ...evento,
        tipoEventoId: evento.tipoEventoId,
        gradoID: evento.gradoID
      };
      delete this.currentEvento.canEditDelete;
      console.log('Evento a editar:', JSON.stringify(this.currentEvento, null, 2));
      console.log('Tipo de evento ID:', this.currentEvento.tipoEventoId);
      console.log('Grado ID:', this.currentEvento.gradoID);
    } else {
      this.currentEvento = {
        titulo: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        usuarioCreadorID: this.userId,
        tipoEventoId: undefined,
        gradoID: null
      };
    }
    console.log('Evento actual al abrir modal:', JSON.stringify(this.currentEvento, null, 2));
  }

  closeModal(): void {
    this.showModal = false;
    this.currentEvento = {
      titulo: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      usuarioCreadorID: this.userId,
      tipoEventoId: undefined,
      gradoID: null
    };
  }

  saveEvento(): void {
    if (this.isEditing) {
      if (this.currentEvento.usuarioCreadorID !== this.userId) {
        console.error('No tienes permiso para editar este evento');
        return;
      }
      let eventoToSave = { ...this.currentEvento, nombreRol: this.userRole, tipoEventoId: this.currentEvento.tipoEventoId || undefined };
      
      if (eventoToSave.gradoID === null) {
        delete eventoToSave.gradoID;
      }
      
      if (eventoToSave.tipoEventoId === undefined) {
        delete eventoToSave.tipoEventoId;
      }
      
      console.log('Datos enviados para actualizar:', JSON.stringify(eventoToSave, null, 2));
      this.eventosService.actualizarEvento(eventoToSave).subscribe(
        (response) => {
          console.log('Respuesta del servidor al actualizar:', response);
          this.loadEventos().subscribe();
          this.closeModal();
        },
        error => {
          console.error('Error al actualizar evento:', error);
        }
      );
    } else {
      if (!this.canAddEvent()) {
        console.error('No tienes permiso para agregar eventos');
        return;
      }
      let eventoToSave = { 
        ...this.currentEvento, 
        usuarioCreadorID: this.userId,
        nombreRol: this.userRole,
        tipoEventoId: this.currentEvento.tipoEventoId || undefined
      };
      
      if (eventoToSave.gradoID === null) {
        delete eventoToSave.gradoID;
      }
      
      if (eventoToSave.tipoEventoId === undefined) {
        delete eventoToSave.tipoEventoId;
      }
      
      console.log('Datos enviados para insertar:', JSON.stringify(eventoToSave, null, 2));
      this.eventosService.insertarEvento(eventoToSave).subscribe(
        (response) => {
          console.log('Respuesta del servidor al insertar:', response);
          this.loadEventos().subscribe();
          this.closeModal();
        },
        error => {
          console.error('Error al agregar evento:', error);
        }
      );
    }
  }

  deleteEvento(eventoID: number | undefined): void {
    const evento = this.eventos.find(e => e.eventoID === eventoID);
    if (!evento || evento.usuarioCreadorID !== this.userId) {
      console.error('No tienes permiso para eliminar este evento');
      return;
    }
    if (eventoID && confirm('¿Está seguro de que desea eliminar este evento?')) {
      console.log('Datos enviados para eliminar:', JSON.stringify({ eventoID }, null, 2));
      this.eventosService.eliminarEvento(eventoID).subscribe(
        (response) => {
          console.log('Respuesta del servidor al eliminar:', response);
          this.loadEventos().subscribe();
        },
        error => console.error('Error al eliminar evento:', error)
      );
    }
  }

  private logEventosLoaded(): void {
    console.log('Eventos cargados:', JSON.stringify(this.eventos, null, 2));
    this.eventos.forEach(evento => {
      console.log(`Evento ID: ${evento.eventoID}, Tipo Evento ID: ${evento.tipoEventoId}, Grado ID: ${evento.gradoID}`);
    });
  }
}

