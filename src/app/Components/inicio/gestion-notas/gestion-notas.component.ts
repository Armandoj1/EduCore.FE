import { Component, OnInit } from '@angular/core';
import { NotasService } from '../../../Services/ControlPeriodos/notas.service';

interface Periodo {
  periodoVigenteID: number;
  nombrePeriodo: string;
  estado: number;
}

interface ApiResponse {
  responseCode: number;
  responseMessage: string;
  idTransactionCode: null;
  rowsAffected: number;
  resultadoConsulta: Periodo[];
  totalPaginas: number;
  totalRegistros: number;
}

@Component({
  selector: 'app-gestion-notas',
  templateUrl: './gestion-notas.component.html',
  styleUrls: ['./gestion-notas.component.css']
})
export class GestionNotasComponent implements OnInit {
  periodos: Periodo[] = [];

  constructor(private notasService: NotasService) { }

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.notasService.verPeriodos().subscribe(
      (response: ApiResponse) => {
        console.log('Respuesta de la API:', response);
        if (response && response.responseCode === 200 && response.resultadoConsulta) {
          this.periodos = response.resultadoConsulta;
          console.log('Periodos cargados:', this.periodos);
        } else {
          console.error('Error al cargar los períodos:', response);
        }
      },
      (error) => {
        console.error('Error al cargar los períodos:', error);
      }
    );
  }

  habilitarPeriodo(periodoId: number): void {
    const periodoVigente = { 
      periodoVigenteID: periodoId,
      estado: 1
    };
    
    this.notasService.habilitarPeriodo(periodoVigente).subscribe(
      (response: ApiResponse) => {
        if (response && response.responseCode === 200) {
          console.log('Período habilitado exitosamente');
          this.cargarPeriodos(); // Recargar los períodos después de habilitar
        } else {
          console.error('Error al habilitar el período:', response);
        }
      },
      (error) => {
        console.error('Error al habilitar el período:', error);
      }
    );
  }
}