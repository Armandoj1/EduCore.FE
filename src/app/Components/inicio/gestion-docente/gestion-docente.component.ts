import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../Services/docentes.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Docente {
  CC?: string;
  NombreCompleto?: string;
  FechaNacimiento?: string;
  Direccion?: string;
  Telefono?: string;
  Correo?: string;
  edad?: number;
  EspecialidadID?: number;
  MateriaID?: string;
  GradoID?: number;
  Especialidad?: string;
  Materia?: string;
  Grado?: string;
}

@Component({
  selector: 'app-gestion-docente',
  templateUrl: './gestion-docente.component.html',
  styleUrls: ['./gestion-docente.component.css']
})
export class GestionDocenteComponent implements OnInit {
  docentes: Docente[] = [];
  materiasList: { id: string, nombre: string }[] = [];
  especialidadesList: { id: number, nombre: string }[] = [];
  gradosList: { id: number, nombre: string }[] = [];

  showModal = false;
  isEditing = false;
  currentDocente: Docente = {};

  dropdowns = {
    materias: false,
    especialidades: false,
    grados: false
  };

  constructor(private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.loadDocentes();
    this.loadMaterias();
    this.loadEspecialidades();
    this.loadGrados();
  }

  loadDocentes(): void {
    this.docenteService.getDocentes().pipe(
      catchError(error => {
        console.error('Error al cargar docentes:', error);
        return of([]);
      })
    ).subscribe((response: any) => {
      console.log('Datos de docentes recibidos:', response);
      const data = response.resultadoConsulta;
      this.docentes = data ? data.map((docente: any) => ({
        CC: docente.cc,
        NombreCompleto: docente.nombreCompleto,
        FechaNacimiento: docente.fechaNacimiento,
        Direccion: docente.direccion,
        Telefono: docente.telefono,
        Correo: docente.correo,
        edad: docente.edad,
        Especialidad: docente.especialidad || '',
        Materia: docente.materia || '',
        Grado: docente.grado || '',
        EspecialidadID: docente.especialidadID || 0,
        MateriaID: docente.materiaID ? docente.materiaID.toString() : '',
        GradoID: docente.gradoID || 0
      })) : [];
      console.log('Docentes procesados:', this.docentes);
    });
  }

  loadMaterias(): void {
    this.docenteService.getMaterias().pipe(
      catchError(error => {
        console.error('Error al cargar materias:', error);
        return of([]);
      })
    ).subscribe((response: any) => {
      console.log('Datos de materias recibidos:', response);
      this.materiasList = response.resultadoConsulta ? 
        response.resultadoConsulta.map((materia: any) => ({
          id: materia.materiaID != null ? materia.materiaID.toString() : '',
          nombre: materia.nombreMateria || ''
        })) : [];
      console.log('Materias procesadas:', this.materiasList);
    });
  }

  loadEspecialidades(): void {
    this.docenteService.getEspecialidades().pipe(
      catchError(error => {
        console.error('Error al cargar especialidades:', error);
        return of([]);
      })
    ).subscribe((response: any) => {
      console.log('Datos de especialidades recibidos:', response);
      this.especialidadesList = response.resultadoConsulta ? 
        response.resultadoConsulta.map((especialidad: any) => ({
          id: especialidad.especialidadID || 0,
          nombre: especialidad.nombreEspecialidad || ''
        })) : [];
      console.log('Especialidades procesadas:', this.especialidadesList);
    });
  }

  loadGrados(): void {
    this.docenteService.getGrados().pipe(
      catchError(error => {
        console.error('Error al cargar grados:', error);
        return of([]);
      })
    ).subscribe((response: any) => {
      console.log('Datos de grados recibidos:', response);
      this.gradosList = response.resultadoConsulta ? 
        response.resultadoConsulta.map((grado: any) => ({
          id: grado.gradoID || 0,
          nombre: grado.nombreGrado || ''
        })) : [];
      console.log('Grados procesados:', this.gradosList);
    });
  }

  openModal(docente?: Docente): void {
    this.showModal = true;
    this.isEditing = !!docente;
    this.currentDocente = docente ? { ...docente } : {};
  }

  closeModal(): void {
    this.showModal = false;
    this.currentDocente = {};
    this.dropdowns = {
      materias: false,
      especialidades: false,
      grados: false
    };
  }

  saveDocente(): void {
    // Preparamos el objeto con todos los campos que la API necesita
    const docenteParaGuardar: Partial<Docente> = {
      CC: this.currentDocente.CC,
      NombreCompleto: this.currentDocente.NombreCompleto,
      FechaNacimiento: this.currentDocente.FechaNacimiento?.split('T')[0], 
      Direccion: this.currentDocente.Direccion,
      Telefono: this.currentDocente.Telefono,
      Correo: this.currentDocente.Correo,
    };
  
    console.log('Datos que se mandan a la API:', docenteParaGuardar);
  
    if (this.isEditing) {
      this.docenteService.actualizarDocente(docenteParaGuardar).subscribe(
        () => {
          this.loadDocentes();
          this.closeModal();
        },
        error => {
          console.error('Error al actualizar docente:', error);
        }
      );
    } else {
      this.docenteService.insertarDocente(docenteParaGuardar).subscribe(
        () => {
          this.loadDocentes();
          this.closeModal();
        },
        error => {
          console.error('Error al agregar docente:', error);
        }
      );
    }
  }
    
  deleteDocente(cc: string | undefined): void {
    if (cc && confirm('¿Está seguro de que desea eliminar este docente?')) {
      this.docenteService.eliminarDocente(cc).subscribe(
        () => this.loadDocentes(),
        error => console.error('Error al eliminar docente:', error)
      );
    }
  }

  toggleDropdown(type: 'materias' | 'especialidades' | 'grados'): void {
    this.dropdowns[type] = !this.dropdowns[type];
  }

  selectItem(type: 'MateriaID' | 'EspecialidadID' | 'GradoID', id: string | number): void {
    if (type === 'MateriaID') {
      this.currentDocente[type] = id.toString();
    } else {
      this.currentDocente[type] = typeof id === 'string' ? parseInt(id, 10) : id;
    }
    this.dropdowns[type === 'MateriaID' ? 'materias' : type === 'EspecialidadID' ? 'especialidades' : 'grados'] = false;
  }

  getSelectedItemName(type: 'MateriaID' | 'EspecialidadID' | 'GradoID'): string {
    const list = type === 'MateriaID' ? this.materiasList : type === 'EspecialidadID' ? this.especialidadesList : this.gradosList;
    const currentId = this.currentDocente[type];
    const item = list.find(i => i.id.toString() === (currentId?.toString() ?? ''));
    return item ? item.nombre : '';
  }
}