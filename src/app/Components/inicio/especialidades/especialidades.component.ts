import { Component, OnInit } from '@angular/core';
import { EspecialidadesService, Especialidad, EspecialidadDTO } from '../../../Services/especialidades.service';

interface Docente {
  docenteID: string;
  nombreCompleto: string;
  cc: string;
}

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent implements OnInit {
  especialidades: Especialidad[] = [];
  currentEspecialidad: EspecialidadDTO = { especialidadID: 0, docenteID: '' };
  isEditing = false;
  showModal = false;
  searchTerm = '';
  especialidadesList: { id: number, nombre: string }[] = [];
  docentesList: Docente[] = [];
  filteredDocentesList: Docente[] = [];
  filteredEspecialidadesList: { id: number, nombre: string }[] = [];
  dropdowns = {
    EspecialidadID: false,
    DocenteID: false
  };
  selectedDocenteName = '';
  selectedEspecialidadName = '';

  constructor(private especialidadesService: EspecialidadesService) {}

  ngOnInit(): void {
    this.loadEspecialidades();
    this.loadDocentes();
    this.loadEspecialidadesList();
  }

  loadEspecialidades(): void {
    this.especialidadesService.getEspecialidades().subscribe(
      (response) => {
        if (response && response.resultadoConsulta) {
          this.especialidades = response.resultadoConsulta;
        }
      },
      (error) => console.error('Error al cargar especialidades:', error)
    );
  }

  loadDocentes(): void {
    this.especialidadesService.getListaDocentes().subscribe(
      (response) => {
        if (response && response.resultadoConsulta) {
          this.docentesList = response.resultadoConsulta;
          this.filteredDocentesList = this.docentesList;
        }
      },
      (error) => console.error('Error al cargar docentes:', error)
    );
  }

  loadEspecialidadesList(): void {
    this.especialidadesService.getListaEspecialidades().subscribe(
      (response) => {
        if (response && response.resultadoConsulta) {
          this.especialidadesList = response.resultadoConsulta.map(e => ({ id: e.especialidadID, nombre: e.nombreEspecialidad }));
          this.filteredEspecialidadesList = this.especialidadesList;
        }
      },
      (error) => console.error('Error al cargar lista de especialidades:', error)
    );
  }

  openModal(especialidad?: Especialidad): void {
    this.isEditing = !!especialidad;
    this.currentEspecialidad = especialidad 
      ? { especialidadID: especialidad.especialidadID, docenteID: especialidad.docenteID } 
      : { especialidadID: 0, docenteID: '' };
    this.selectedDocenteName = especialidad ? especialidad.nombreCompleto : '';
    this.selectedEspecialidadName = especialidad ? especialidad.nombreEspecialidad : '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentEspecialidad = { especialidadID: 0, docenteID: '' };
    this.selectedDocenteName = '';
    this.selectedEspecialidadName = '';
    this.dropdowns = {
      EspecialidadID: false,
      DocenteID: false
    };
  }

  saveEspecialidad(): void {
    console.log('Datos a guardar:', this.currentEspecialidad);
    if (!this.currentEspecialidad.docenteID || !this.currentEspecialidad.especialidadID) {
      alert('Por favor, seleccione un docente y una especialidad.');
      return;
    }
    if (this.isEditing) {
      this.especialidadesService.actualizarEspecialidad(this.currentEspecialidad).subscribe(
        () => {
          this.loadEspecialidades();
          this.closeModal();
        },
        (error) => console.error('Error al actualizar especialidad:', error)
      );
    } else {
      this.especialidadesService.insertarEspecialidad(this.currentEspecialidad).subscribe(
        () => {
          this.loadEspecialidades();
          this.closeModal();
        },
        (error) => console.error('Error al crear especialidad:', error)
      );
    }
  }

  deleteEspecialidad(id: number, docenteID: string): void {
    if (confirm('¿Está seguro de que desea eliminar esta especialidad?')) {
      this.especialidadesService.eliminarEspecialidad(id, docenteID).subscribe(
        () => this.loadEspecialidades(),
        (error) => console.error('Error al eliminar especialidad:', error)
      );
    }
  }

  toggleDropdown(type: 'EspecialidadID' | 'DocenteID'): void {
    this.dropdowns[type] = !this.dropdowns[type];
  }

  selectItem(type: 'especialidadID' | 'docenteID', value: string | number, name: string): void {
    console.log(`selectItem called with type: ${type}, value: ${value}, name: ${name}`);
    
    if (type === 'docenteID') {
      const selectedDocente = this.docentesList.find(d => d.cc === value);
      if (selectedDocente) {
        this.currentEspecialidad.docenteID = selectedDocente.cc;
        this.selectedDocenteName = selectedDocente.nombreCompleto;
        console.log(`Selected docente: CC=${selectedDocente.cc}, Name=${selectedDocente.nombreCompleto}`);
      } else {
        console.error(`No se encontró el docente con CC: ${value}`);
      }
    } else if (type === 'especialidadID') {
      if (value !== undefined && value !== null && value !== '') {
        this.currentEspecialidad.especialidadID = typeof value === 'number' ? value : parseInt(value, 10);
        this.selectedEspecialidadName = name;
      } else {
        console.error(`Valor inválido seleccionado para especialidadID. Value: ${value}, Name: ${name}`);
      }
    }
    
    this.dropdowns[type === 'especialidadID' ? 'EspecialidadID' : 'DocenteID'] = false;
    console.log(`Updated currentEspecialidad:`, this.currentEspecialidad);
  }

  filterItems(type: 'especialidadID' | 'docenteID', event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (type === 'especialidadID') {
      this.filteredEspecialidadesList = this.especialidadesList.filter(e => 
        e.nombre.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredDocentesList = this.docentesList.filter(d => 
        d.nombreCompleto.toLowerCase().includes(searchTerm) || d.cc.toLowerCase().includes(searchTerm)
      );
    }
    this.dropdowns[type === 'especialidadID' ? 'EspecialidadID' : 'DocenteID'] = true;
  }
}