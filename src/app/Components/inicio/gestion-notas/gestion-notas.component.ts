import { Component, OnInit } from '@angular/core';

interface Asignatura {
  nombre: string;
  ih: number;
  notas: number[];
  promedio: number;
  desempeno: string;
}

interface DatosEstudiante {
  codigo: string;
  nombre: string;
  curso: string;
  periodo: number;
  promedio: number;
  ano: number;
  jornada: string;
  puesto: string;
}

@Component({
  selector: 'app-gestion-notas',
  templateUrl: './gestion-notas.component.html',
  styleUrls: ['./gestion-notas.component.css']
})
export class GestionNotasComponent implements OnInit {
  estudiante: DatosEstudiante = {
    codigo: '001120',
    nombre: 'RODRIGUEZ TAPIA CRISTIAM ALEJANDRO',
    curso: '0502',
    periodo: 3,
    promedio: 86,
    ano: 2022,
    jornada: 'DIURNA',
    puesto: '4 de 21'
  };

  asignaturas: Asignatura[] = [
    { nombre: 'CIENCIAS NATURALES', ih: 4, notas: [95, 70, 80], promedio: 82, desempeno: 'ALTO' },
    { nombre: 'CIENCIAS SOCIALES', ih: 4, notas: [90, 95, 90], promedio: 92, desempeno: 'SUPERIOR' },
    { nombre: 'EDUCACION ARTISTICA', ih: 2, notas: [90, 90, 90], promedio: 90, desempeno: 'SUPERIOR' },
    { nombre: 'EDUCACION ETICA', ih: 2, notas: [85, 85, 82], promedio: 82, desempeno: 'ALTO' },
    { nombre: 'EDUCACION FISICA Y DEPORTE', ih: 2, notas: [80, 85, 85], promedio: 83, desempeno: 'ALTO' },
    { nombre: 'EDUCACION RELIGIOSA', ih: 2, notas: [85, 80], promedio: 82, desempeno: 'ALTO' },
    { nombre: 'HUMANIDADES CASTELLANO', ih: 5, notas: [90, 88, 88], promedio: 88, desempeno: 'SUPERIOR' },
    { nombre: 'HUMANIDADES INGLES', ih: 2, notas: [90, 85, 85], promedio: 85, desempeno: 'ALTO' },
    { nombre: 'MATEMATICAS', ih: 5, notas: [100, 95, 85], promedio: 93, desempeno: 'SUPERIOR' },
    { nombre: 'TECNOLOGIA E INFORMATICA', ih: 2, notas: [80, 75, 90], promedio: 82, desempeno: 'SUPERIOR' },
    { nombre: 'COMPORTAMIENTO ESCOLAR', ih: 0, notas: [100, 100, 100, 100], promedio: 100, desempeno: 'SUPERIOR' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onImprimir(): void {
    window.print();
  }

  onEnviarCorreo(): void {
    console.log('Enviando boletín por correo...');
    alert('Boletín enviado por correo (simulación)');
  }
}