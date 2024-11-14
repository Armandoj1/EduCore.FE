import { Component, OnInit } from '@angular/core';
import { GradosService, Grado, GradoDTO } from '../../../Services/grados.service';

@Component({
  selector: 'app-gestion-grados',
  templateUrl: './gestion-grados.component.html',
  styleUrls: ['./gestion-grados.component.css'],
})
export class GestionGradosComponent implements OnInit {
  grados: Grado[] = [];
  currentGrado: GradoDTO = { gradoID: '', docenteID: '', materiaID: '' };
  isEditing = false;
  showModal = false;

  gradosList: { gradoID: string; nombreGrado: string }[] = [];
  docentesList: { docenteID: string; nombreCompleto: string; cc: string }[] = [];
  materiasList: { materiaID: string; nombreMateria: string }[] = [];

  constructor(private gradosService: GradosService) {}

  ngOnInit(): void {
    this.loadGrados();
    this.loadGradosList();
    this.loadDocentesList();
    this.loadMateriasList();
  }

  loadGrados(): void {
    this.gradosService.LoadGrados().subscribe(
      (grados) => {
        this.grados = grados;
        console.log('Grados cargados:', this.grados);
      },
      (error) => console.error('Error al cargar grados:', error)
    );
  }

  loadGradosList(): void {
    this.gradosService.comboboxGrados().subscribe(
      (response) => {
        this.gradosList = response.resultadoConsulta;
        console.log('Lista de grados cargada:', this.gradosList);
      },
      (error) => console.error('Error al cargar grados para el combobox:', error)
    );
  }

  loadDocentesList(): void {
    this.gradosService.comboboxDocente().subscribe(
      (response) => {
        this.docentesList = response.resultadoConsulta.map(docente => ({
          docenteID: docente.cc,
          nombreCompleto: docente.nombreCompleto,
          cc: docente.cc
        }));
        console.log('Lista de docentes cargada:', this.docentesList);
      },
      (error) => console.error('Error al cargar docentes para el combobox:', error)
    );
  }

  loadMateriasList(): void {
    this.gradosService.comboboxMateria().subscribe(
      (response) => {
        this.materiasList = response.resultadoConsulta;
        console.log('Lista de materias cargada:', this.materiasList);
      },
      (error) => console.error('Error al cargar materias para el combobox:', error)
    );
  }

  openModal(grado?: Grado): void {
    this.isEditing = !!grado;
    if (grado) {
      this.currentGrado = {
        gradoID: grado.gradoID,
        docenteID: grado.docenteID,
        materiaID: grado.materiaID
      };
      console.log('Editando grado:', this.currentGrado);
    } else {
      this.currentGrado = { gradoID: '', docenteID: '', materiaID: '' };
    }
    this.showModal = true;
    setTimeout(() => this.logCurrentGrado(), 0);
  }

  saveGrado(): void {
    if (!this.currentGrado.gradoID || !this.currentGrado.docenteID || !this.currentGrado.materiaID) {
      alert('Complete todos los campos.');
      return;
    }

    const saveObservable = this.isEditing
      ? this.gradosService.updateGrado(this.currentGrado)
      : this.gradosService.createGrado(this.currentGrado);

    saveObservable.subscribe(
      () => {
        this.loadGrados();
        this.closeModal();
      },
      (error) => console.error('Error al guardar grado:', error)
    );
  }

  closeModal(): void {
    this.showModal = false;
    this.currentGrado = { gradoID: '', docenteID: '', materiaID: '' };
  }

  deleteGrado(gradoID: string): void {
    if (confirm('¿Está seguro de eliminar este grado?')) {
      this.gradosService.deleteGrado(gradoID).subscribe(
        () => this.loadGrados(),
        (error) => console.error('Error al eliminar grado:', error)
      );
    }
  }

  onSelectionChange(type: 'grado' | 'docente' | 'materia', id: string): void {
    console.log(`Seleccionado (${type}):`, id);
    this.logCurrentGrado();
  }

  logCurrentGrado(): void {
    console.log('Current Grado:', this.currentGrado);
    console.log('Docente seleccionado:', this.docentesList.find(d => d.docenteID === this.currentGrado.docenteID));
  }
}