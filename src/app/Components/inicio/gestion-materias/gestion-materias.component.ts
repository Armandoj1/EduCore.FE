import { Component, OnInit } from '@angular/core';
import { MateriasService, Materia, MateriaInsertDTO, MateriaUpdateDTO } from '../../../Services/materias.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface MateriaItem {
  materiaID: string;
  nombreMateria: string;
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
  materias: Materia[] = [];
  currentMateria: MateriaInsertDTO | MateriaUpdateDTO = { materiaID: '', gradoID: 0 };
  isEditing = false;
  showModal = false;
  materiasList: MateriaItem[] = [];
  gradosList: { id: number, nombre: string }[] = [];
  filteredMateriasList: MateriaItem[] = [];
  filteredGradosList: { id: number, nombre: string }[] = [];
  dropdowns = {
    MateriaID: false,
    GradoID: false,
  };
  selectedMateriaNombre = '';
  selectedGradoName = '';
  searchTerm = '';

  constructor(private materiasService: MateriasService) { }

  ngOnInit(): void {
    this.loadMaterias();
    this.loadMateriasList();
    this.loadGradosList();
  }

  loadMaterias(): void {
    this.materiasService.getMaterias().subscribe(
      (response) => {
        if (response && response.resultadoConsulta) {
          this.materias = response.resultadoConsulta;
        }
      },
      (error) => console.error('Error al cargar materias:', error)
    );
  }

  loadMateriasList(): void {
    this.materiasService.getListaMaterias().subscribe(
      (response) => {
        if (response && response.resultadoConsulta) {
          this.materiasList = response.resultadoConsulta;
          this.filteredMateriasList = this.materiasList;
        }
      },
      (error) => console.error('Error al cargar lista de materias:', error)
    );
  }

  loadGradosList(): void {
    this.materiasService.getListaGrados().subscribe(
      (response) => {
        if (response && response.resultadoConsulta) {
          this.gradosList = response.resultadoConsulta.map(g => ({ id: g.gradoID, nombre: g.nombreGrado }));
          this.filteredGradosList = this.gradosList;
        }
      },
      (error) => console.error('Error al cargar lista de grados:', error)
    );
  }

  openModal(materia?: Materia): void {
    this.isEditing = !!materia;
    if (materia) {
      this.currentMateria = { 
        materiaID: materia.materiaID, 
        gradoID: materia.gradoID,
        nuevaMateriaID: materia.materiaID // Inicializamos nuevaMateria con el ID actual
      };
      this.selectedMateriaNombre = materia.nombreMateria;
      this.selectedGradoName = materia.nombreGrado;
    } else {
      this.currentMateria = { materiaID: '', gradoID: 0 };
      this.selectedMateriaNombre = '';
      this.selectedGradoName = '';
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentMateria = { materiaID: '', gradoID: 0 };
    this.selectedMateriaNombre = '';
    this.selectedGradoName = '';
    this.dropdowns = {
      MateriaID: false,
      GradoID: false,
    };
  }

  saveMateria(): void {
    if (!this.currentMateria.materiaID || !this.currentMateria.gradoID) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    if (this.isEditing) {
      const updateDTO: MateriaUpdateDTO = {
        materiaID: this.currentMateria.materiaID,
        gradoID: this.currentMateria.gradoID,
        nuevaMateriaID: (this.currentMateria as MateriaUpdateDTO).nuevaMateriaID
      };
      console.log('Intentando actualizar materia:', JSON.stringify(updateDTO, null, 2));
      this.materiasService.actualizarMateria(updateDTO).subscribe(
        (response) => {
          console.log('Respuesta de actualización:', JSON.stringify(response, null, 2));
          this.loadMaterias();
          this.closeModal();
        },
        (error) => {
          console.error('Error al actualizar materia:', error);
          if (error.error) {
            console.error('Detalles del error:', JSON.stringify(error.error, null, 2));
          }
        }
      );
    } else {
      const insertDTO: MateriaInsertDTO = {
        materiaID: this.currentMateria.materiaID,
        gradoID: this.currentMateria.gradoID
      };
      console.log('Intentando insertar materia:', JSON.stringify(insertDTO, null, 2));
      this.materiasService.insertarMateria(insertDTO).subscribe(
        (response) => {
          console.log('Respuesta de inserción:', JSON.stringify(response, null, 2));
          this.loadMaterias();
          this.loadMateriasList();
          this.closeModal();
        },
        (error) => {
          console.error('Error al crear materia:', error);
          if (error.error) {
            console.error('Detalles del error:', JSON.stringify(error.error, null, 2));
          }
        }
      );
    }
  }

  deleteMateria(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar esta materia?')) {
      this.materiasService.eliminarMateria(id).subscribe(
        () => {
          this.loadMaterias();
          this.loadMateriasList();
        },
        (error) => console.error('Error al eliminar materia:', error)
      );
    }
  }

  toggleDropdown(type: 'MateriaID' | 'GradoID'): void {
    this.dropdowns[type] = !this.dropdowns[type];
  }

  selectItem(type: 'materiaID' | 'gradoID', value: string | number, name: string): void {
    if (type === 'materiaID') {
      if (this.isEditing) {
        // Si estamos editando, actualizamos nuevaMateria con el nuevo ID seleccionado
        (this.currentMateria as MateriaUpdateDTO).nuevaMateriaID = value as string;
      } else {
        // Si estamos creando, actualizamos materiaID
        this.currentMateria.materiaID = value as string;
      }
      this.selectedMateriaNombre = name;
    } else if (type === 'gradoID') {
      this.currentMateria.gradoID = value as number;
      this.selectedGradoName = name;
    }
    this.dropdowns[type === 'materiaID' ? 'MateriaID' : 'GradoID'] = false;
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

  searchMateria(): void {
    if (this.searchTerm) {
      this.materias = this.materias.filter(m => 
        m.nombreMateria.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.materiaID.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.nombreGrado.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.loadMaterias();
    }
  }
}

