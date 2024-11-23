import { Component, OnInit } from '@angular/core';
import { EstudianteService } from '../../../Services/estudiantes.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Estudiante {
  cc?: string;
  nombreCompleto?: string;
  fechaNacimiento?: string;
  direccion?: string;
  edad?: number;
  telefono?: string;
  correo?: string;
  gradoID?: number;
  nombreGrado?: string;
}

@Component({
  selector: 'app-gestion-estudiante',
  templateUrl: './gestion-estudiante.component.html',
  styleUrls: ['./gestion-estudiante.component.css']
})
export class GestionEstudianteComponent implements OnInit {
  openAddStudentModal() {
    throw new Error('Method not implemented.');
  }
  isModalOpen(isModalOpen: any) {
    throw new Error('Method not implemented.');
  }
  addStudent() {
    throw new Error('Method not implemented.');
  }
  estudiantes: Estudiante[] = [];
  gradosList: { id: number, nombre: string }[] = [];

  showModal = false;
  isEditing = false;
  currentEstudiante: Estudiante = {};

  dropdowns = {
    grados: false
  };
  students: any;
  //  newStudent: { id: string; name: string; age: number; email: string; grade: string; birthdate: string; address: string; phone: string; };

  constructor(private EstudianteService: EstudianteService) {}

  ngOnInit(): void {
    this.loadEstudiantes();
    this.loadGrados();
  }

  loadEstudiantes(): void {
    this.EstudianteService.getEstudiantes().pipe(
      catchError(error => {
        console.error('Error al cargar estudiantes:', error);
        return of([]);
      })
    ).subscribe((response: any) => {
      console.log('Datos de estudiantes recibidos:', response);
      const data = response.resultadoConsulta;
      this.estudiantes = data ? data.map((estudiante: any) => ({
        cc: estudiante.cc,
        nombreCompleto: estudiante.nombreCompleto,
        fechaNacimiento: estudiante.fechaNacimiento,
        direccion: estudiante.direccion,
        edad: estudiante.edad,
        telefono: estudiante.telefono,
        correo: estudiante.correo,
        gradoID: estudiante.gradoID,
        nombreGrado: estudiante.nombreGrado
      })) : [];
      console.log('Estudiantes procesados:', this.estudiantes);
    });
  }

  loadGrados(): void {
    this.EstudianteService.getGrados().pipe(
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

  openModal(estudiante?: Estudiante): void {
    this.showModal = true;
    this.isEditing = !!estudiante;
    this.currentEstudiante = estudiante ? { ...estudiante } : {};
  }

  closeModal(): void {
    this.showModal = false;
    this.currentEstudiante = {};
    this.dropdowns = {
      grados: false
    };
  }

  saveEstudiante(): void {
    const estudianteParaGuardar: Partial<Estudiante> = {
      cc: this.currentEstudiante.cc,
      nombreCompleto: this.currentEstudiante.nombreCompleto,
      fechaNacimiento: this.currentEstudiante.fechaNacimiento?.split('T')[0],
      direccion: this.currentEstudiante.direccion,
      telefono: this.currentEstudiante.telefono,
      correo: this.currentEstudiante.correo
    };
  
    console.log('Datos que se mandan a la API:', estudianteParaGuardar);
  
    if (this.isEditing) {
      this.EstudianteService.actualizarEstudiante(estudianteParaGuardar).subscribe(
        () => {
          this.loadEstudiantes();
          this.closeModal();
        },
        error => {
          console.error('Error al actualizar estudiante:', error);
        }
      );
    } else {
      this.EstudianteService.insertarEstudiante(estudianteParaGuardar).subscribe(
        () => {
          this.loadEstudiantes();
          this.closeModal();
        },
        error => {
          console.error('Error al agregar estudiante:', error);
        }
      );
    }
  }
    
  deleteEstudiante(cc: string | undefined): void {
    if (cc && confirm('¿Está seguro de que desea eliminar este estudiante?')) {
      this.EstudianteService.eliminarEstudiante(cc).subscribe(
        () => this.loadEstudiantes(),
        error => console.error('Error al eliminar estudiante:', error)
      );
    }
  }

  toggleDropdown(type: 'grados'): void {
    this.dropdowns[type] = !this.dropdowns[type];
  }

  selectItem(type: 'gradoID', id: number): void {
    this.currentEstudiante[type] = id;
    this.dropdowns.grados = false;
  }

  getSelectedItemName(type: 'gradoID'): string {
    const currentId = this.currentEstudiante[type];
    const item = this.gradosList.find(i => i.id === currentId);
    return item ? item.nombre : '';
  }
}