import { Component, OnInit } from '@angular/core';
import { GradosEstudiantesService, GradoEstudiante, GradoEstudianteDTO } from '../../../Services/grados-estudiantes.service';

interface Estudiante {
  estudianteCC: string;
  nombreCompleto: string;
}

@Component({
  selector: 'app-grados-estudiantes',
  templateUrl: './grados-estudiantes.component.html',
  styleUrls: ['./grados-estudiantes.component.css']
})
export class GradosEstudiantesComponent implements OnInit {
  gradosEstudiantes: GradoEstudiante[] = [];
  currentGradoEstudiante: GradoEstudianteDTO = { gradoID: 0, estudianteCC: '' };
  isEditing = false;
  showModal = false;
  estudiantesList: Estudiante[] = [];
  gradosList: { id: number, nombre: string }[] = [];
  filteredEstudiantesList: Estudiante[] = [];
  filteredGradosList: { id: number, nombre: string }[] = [];
  dropdowns = {
    GradoID: false,
    EstudianteCC: false
  };
  selectedEstudianteName = '';
  selectedGradoName = '';
  estudiantesAsignados: Estudiante[] = [];
  selectedGradoId: number | null = null;

  constructor(private gradosEstudiantesService: GradosEstudiantesService) {}

  ngOnInit(): void {
    this.loadGradosEstudiantes();
    this.loadEstudiantes();
    this.loadGradosList();
  }

  loadGradosEstudiantes(): void {
    this.gradosEstudiantesService.getGradosEstudiantes().subscribe(
      (response) => {
        if (response && response.resultadoConsulta) {
          this.gradosEstudiantes = response.resultadoConsulta;
        }
      },
      (error) => console.error('Error al cargar grados y estudiantes:', error)
    );
  }

  loadEstudiantes(): void {
    this.gradosEstudiantesService.getListaEstudiantes().subscribe(
      (response) => {
        if (response && response.resultadoConsulta) {
          this.estudiantesList = response.resultadoConsulta;
          this.filteredEstudiantesList = this.estudiantesList;
        }
      },
      (error) => console.error('Error al cargar estudiantes:', error)
    );
  }

  loadGradosList(): void {
    this.gradosEstudiantesService.getListaGrados().subscribe(
      (response) => {
        if (response && response.resultadoConsulta) {
          this.gradosList = response.resultadoConsulta.map(g => ({ id: g.gradoID, nombre: g.nombreGrado }));
          this.filteredGradosList = this.gradosList;
        }
      },
      (error) => console.error('Error al cargar lista de grados:', error)
    );
  }

  openModal(gradoEstudiante?: GradoEstudiante): void {
    this.isEditing = !!gradoEstudiante;
    this.currentGradoEstudiante = gradoEstudiante 
      ? { gradoID: gradoEstudiante.gradoID, estudianteCC: gradoEstudiante.estudianteCC } 
      : { gradoID: 0, estudianteCC: '' };
    this.selectedEstudianteName = gradoEstudiante ? gradoEstudiante.nombreCompleto : '';
    this.selectedGradoName = gradoEstudiante ? gradoEstudiante.nombreGrado : '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentGradoEstudiante = { gradoID: 0, estudianteCC: '' };
    this.selectedEstudianteName = '';
    this.selectedGradoName = '';
    this.dropdowns = {
      GradoID: false,
      EstudianteCC: false
    };
  }

  saveGradoEstudiante(): void {
    if (!this.currentGradoEstudiante.estudianteCC || !this.currentGradoEstudiante.gradoID) {
      alert('Por favor, seleccione un estudiante y un grado.');
      return;
    }
    if (this.isEditing) {
      this.gradosEstudiantesService.actualizarGradoEstudiante(this.currentGradoEstudiante).subscribe(
        () => {
          this.loadGradosEstudiantes();
          this.closeModal();
        },
        (error) => console.error('Error al actualizar grado-estudiante:', error)
      );
    } else {
      this.gradosEstudiantesService.insertarGradoEstudiante(this.currentGradoEstudiante).subscribe(
        () => {
          this.loadGradosEstudiantes();
          this.loadEstudiantes();
          this.loadGradosList();
          this.closeModal();
        },
        (error) => console.error('Error al crear grado-estudiante:', error)
      );
    }
  }

  deleteGradoEstudiante(id: number, estudianteCC: string): void {
    if (confirm('¿Está seguro de que desea eliminar esta asignación de grado-estudiante?')) {
      this.gradosEstudiantesService.eliminarGradoEstudiante(id, estudianteCC).subscribe(
        () => {this.loadGradosEstudiantes();
              this.loadEstudiantes();
              this.loadGradosList();
         },
        (error) => console.error('Error al eliminar grado-estudiante:', error)
      );
    }
  }

  toggleDropdown(type: 'GradoID' | 'EstudianteCC'): void {
    this.dropdowns[type] = !this.dropdowns[type];
  }

  selectItem(type: 'gradoID' | 'estudianteCC', value: string | number, name: string): void {
    if (type === 'estudianteCC') {
      this.currentGradoEstudiante.estudianteCC = value as string;
      this.selectedEstudianteName = name;
    } else if (type === 'gradoID') {
      this.currentGradoEstudiante.gradoID = typeof value === 'number' ? value : parseInt(value, 10);
      this.selectedGradoName = name;
    }
    this.dropdowns[type === 'gradoID' ? 'GradoID' : 'EstudianteCC'] = false;
  }

  filterItems(type: 'gradoID' | 'estudianteCC', event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (type === 'gradoID') {
      this.filteredGradosList = this.gradosList.filter(g => 
        g.nombre.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredEstudiantesList = this.estudiantesList.filter(e => 
        e.nombreCompleto.toLowerCase().includes(searchTerm) || e.estudianteCC.toLowerCase().includes(searchTerm)
      );
    }
    this.dropdowns[type === 'gradoID' ? 'GradoID' : 'EstudianteCC'] = true;
  }

  loadEstudiantesAsignados(gradoID: number): void {
    this.selectedGradoId = gradoID;
    this.estudiantesAsignados = this.gradosEstudiantes
      .filter(g => g.gradoID === gradoID)
      .map(g => ({ estudianteCC: g.estudianteCC, nombreCompleto: g.nombreCompleto }));
  }
}