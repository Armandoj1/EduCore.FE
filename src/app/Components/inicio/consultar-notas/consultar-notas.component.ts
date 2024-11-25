import { Component, OnInit } from '@angular/core';
import { ConsultarNotasService, ApiResponse } from '../../../Services/ConsultarNotas/consultar-notas.service';
import { SharedUserService, User } from '../../../Services/shared-user.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface MateriaItem {
  materiaID: string;
  nombreMateria: string;
}

interface GradoItem {
  id: number;
  nombre: string;
}

interface Nota {
  nombreEstudiante: string;
  nota1: number;
  nota2: number;
  nota3: number;
  nota4: number;
}

@Component({
  selector: 'app-consultar-notas',
  templateUrl: './consultar-notas.component.html',
  styleUrls: ['./consultar-notas.component.css'],
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
export class ConsultarNotasComponent implements OnInit {
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
        this.loadGradosDocentes(user.usuario);
        this.loadMateriasDocentes(user.usuario);
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
      this.consultarNotasService.consultarNotasGrados(this.selectedGrado.id, this.selectedMateria.materiaID).subscribe(
        (response: ApiResponse) => {
          console.log('Respuesta de notas:', response);
          if (response && response.resultadoConsulta) {
            this.notas = response.resultadoConsulta as Nota[];
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
}

