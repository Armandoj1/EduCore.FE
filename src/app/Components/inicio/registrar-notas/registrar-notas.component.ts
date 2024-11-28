import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConsultarNotasService, ApiResponse } from '../../../Services/ConsultarNotas/consultar-notas.service';
import { SharedUserService, User } from '../../../Services/shared-user.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { RegistrarNotasService, Nota as NotaServicio } from '../../../Services/registrarNotas/registrar-notas.service';
import { NotasService, PeriodoVigente } from '../../../Services/ControlPeriodos/notas.service';

interface MateriaItem {
  materiaID: string;
  nombreMateria: string;
}

interface GradoItem {
  id: number;
  nombre: string;
}

interface NotaComponente {
  cc: string;
  nombreEstudiante: string;
  nota1: number;
  nota2: number;
  nota3: number;
  nota4: number;
}

@Component({
  selector: 'app-registrar-notas',
  templateUrl: './registrar-notas.component.html',
  styleUrls: ['./registrar-notas.component.css'],
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

export class RegistrarNotasComponent implements OnInit {
  materiasList: MateriaItem[] = [];
  gradosList: GradoItem[] = [];
  filteredMateriasList: MateriaItem[] = [];
  filteredGradosList: GradoItem[] = [];
  dropdowns = {
    MateriaID: false,
    GradoID: false,
  };
  selectedMateria: MateriaItem | null = null;
  selectedGrado: GradoItem | null = null;
  notas: NotaComponente[] = [];
  notasOriginales: NotaComponente[] = [];
  currentUser: User | null = null;
  errorMessage: string | null = null;
  periodoVigente: PeriodoVigente | null = null;

  constructor(
    private consultarNotasService: ConsultarNotasService,
    private sharedUserService: SharedUserService,
    private registrarNotasService: RegistrarNotasService,
    private notasService: NotasService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('Iniciando componente...');
    this.sharedUserService.currentUserData.subscribe(user => {
      this.currentUser = user;
      if (user) {
        console.log('Usuario actual:', user);
        this.loadGradosDocentes(user.usuario);
        this.loadMateriasDocentes(user.usuario);
        this.loadPeriodoVigente();
      }
    });
  }

  loadGradosDocentes(docenteCC: string): void {
    console.log('Cargando grados para el docente:', docenteCC);
    this.consultarNotasService.consultarGradosDocentes(docenteCC).subscribe(
      (response: ApiResponse) => {
        console.log('Respuesta de grados:', response);
        if (response && response.resultadoConsulta) {
          this.gradosList = response.resultadoConsulta.map(g => ({ id: g.gradoID, nombre: g.nombreGrado }));
          this.filteredGradosList = this.gradosList;
          console.log('Grados cargados:', this.gradosList);
        }
      },
      (error) => console.error('Error al cargar grados del docente:', error)
    );
  }

  loadMateriasDocentes(docenteCC: string): void {
    console.log('Cargando materias para el docente:', docenteCC);
    this.consultarNotasService.consultarMateriasDocentes(docenteCC).subscribe(
      (response: ApiResponse) => {
        console.log('Respuesta de materias:', response);
        if (response && response.resultadoConsulta) {
          this.materiasList = response.resultadoConsulta.map(m => ({ materiaID: m.materiaID, nombreMateria: m.nombreMateria }));
          this.filteredMateriasList = this.materiasList;
          console.log('Materias cargadas:', this.materiasList);
        }
      },
      (error) => console.error('Error al cargar materias del docente:', error)
    );
  }

  loadPeriodoVigente(): void {
    console.log('Iniciando carga de periodo vigente...');
    this.notasService.consultarPeriodoVigente({}).subscribe({
      next: (periodoVigente: PeriodoVigente) => {
        console.log('Datos recibidos del servicio:', periodoVigente);
        this.periodoVigente = periodoVigente;
        console.log('Periodo vigente establecido:', this.periodoVigente);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al consultar periodo vigente:', error);
        this.errorMessage = "No se pudo cargar el periodo vigente. Por favor, intente de nuevo más tarde.";
        this.periodoVigente = null;
        this.cdr.detectChanges();
      }
    });
  }

  toggleDropdown(type: 'MateriaID' | 'GradoID'): void {
    this.dropdowns[type] = !this.dropdowns[type];
  }

  selectItem(type: 'materiaID' | 'gradoID', item: MateriaItem | GradoItem): void {
    if (type === 'gradoID') {
      this.selectedGrado = item as GradoItem;
    } else if (type === 'materiaID') {
      this.selectedMateria = item as MateriaItem;
    }
    this.dropdowns[type === 'gradoID' ? 'GradoID' : 'MateriaID'] = false;
  }

  filterItems(type: 'materiaID' | 'gradoID', event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (type === 'materiaID') {
      this.filteredMateriasList = this.materiasList.filter(m =>
        m.nombreMateria.toLowerCase().includes(searchTerm) || m.materiaID.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredGradosList = this.gradosList.filter(g =>
        g.nombre.toLowerCase().includes(searchTerm)
      );
    }
    this.dropdowns[type === 'materiaID' ? 'MateriaID' : 'GradoID'] = true;
  }

  consultarNotas(): void {
    if (this.selectedGrado && this.selectedMateria) {
      console.log('Consultando notas para:', this.selectedGrado, this.selectedMateria);
      this.consultarNotasService.consultarNotasGradosID(this.selectedGrado.id, this.selectedMateria.materiaID).subscribe(
        (response: ApiResponse) => {
          console.log('Respuesta de notas:', response);
          if (response && response.resultadoConsulta) {
            this.notas = response.resultadoConsulta.map(nota => ({
              ...nota,
              nota1: Number(nota.nota1) || 0,
              nota2: Number(nota.nota2) || 0,
              nota3: Number(nota.nota3) || 0,
              nota4: Number(nota.nota4) || 0
            }));
            this.notasOriginales = JSON.parse(JSON.stringify(this.notas));
            console.log('Notas consultadas:', this.notas);
            if (this.notas.length === 0) {
              this.errorMessage = "¡La materia no está asignada al grado, no se mostrarán las calificaciones!";
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
    } else {
      alert('Por favor, seleccione un grado y una materia.');
    }
  }

  isNotaEditable(periodoID: number): boolean {
    if (!this.periodoVigente || this.periodoVigente.periodoVigenteID === undefined) {
      console.warn('Periodo vigente no disponible o inválido');
      return false;
    }
    return periodoID === this.periodoVigente.periodoVigenteID;
  }

  registrarNotas(): void {
    if (!this.selectedMateria) {
      console.error('No se ha seleccionado una materia');
      return;
    }

    const notasModificadas: NotaServicio[] = [];

    this.notas.forEach((notaActual, index) => {
      const notaOriginal = this.notasOriginales[index];

      [1, 2, 3, 4].forEach(periodoID => {
        const notaKey = `nota${periodoID}` as keyof NotaComponente;
        const valorOriginal = Number(notaOriginal[notaKey]) || 0;
        const valorActual = Number(notaActual[notaKey]) || 0;

        if (valorActual !== valorOriginal && this.isNotaEditable(periodoID)) {
          const notaModificada: NotaServicio = {
            estudianteCC: notaActual.cc,
            materiaID: this.selectedMateria!.materiaID,
            periodoID: periodoID,
            notaValor: valorActual
          };
          notasModificadas.push(notaModificada);
          console.log(`Nota modificada - Estudiante: ${notaActual.cc}, Período: ${periodoID}, Valor Original: ${valorOriginal}, Valor Nuevo: ${valorActual}`);
        }
      });
    });

    console.log('Notas a registrar:', notasModificadas);

    if (notasModificadas.length === 0) {
      console.log('No hay notas para registrar');
      return;
    }

    notasModificadas.forEach(nota => {
      const notaOriginal = Number(this.notasOriginales.find(n => n.cc === nota.estudianteCC)?.[`nota${nota.periodoID}` as keyof NotaComponente]) || 0;

      if (notaOriginal === 0) {
        console.log('Insertando nota:', nota);
        this.registrarNotasService.insertarNota(nota).subscribe({
          next: response => console.log('Nota insertada:', response),
          error: error => console.error('Error al insertar nota:', error)
        });
      } else {
        console.log('Actualizando nota:', nota);
        this.registrarNotasService.actualizarNota(nota).subscribe({
          next: response => console.log('Nota actualizada:', response),
          error: error => console.error('Error al actualizar nota:', error)
        });
      }
    });

    // Actualizamos las notas originales después de guardar
    this.notasOriginales = JSON.parse(JSON.stringify(this.notas));
  }
}

