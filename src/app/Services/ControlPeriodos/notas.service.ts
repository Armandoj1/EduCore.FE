import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface PeriodoVigente {
  periodoVigenteID: number;
  nombrePeriodo: string;
}

export interface ApiResponse {
  resultadoConsulta: PeriodoVigente[];
  exitoso: boolean;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotasService {
  private apiUrl = 'https://localhost:7099/api/Notas';

  constructor(private http: HttpClient) { }

  consultarPeriodoVigente(filtro: any): Observable<PeriodoVigente> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarPeriodoVigente`)
      .pipe(
        map((response: ApiResponse) => {
          console.log('Respuesta raw del servidor:', response);
          
          if (!response || !response.resultadoConsulta || response.resultadoConsulta.length === 0) {
            throw new Error('No se encontró el periodo vigente');
          }

          const rawData = response.resultadoConsulta[0];
          console.log('Datos sin procesar:', rawData);

          const periodoVigente: PeriodoVigente = {
            periodoVigenteID: this.parseNumber(rawData.periodoVigenteID),
            nombrePeriodo: rawData.nombrePeriodo
          };

          if (isNaN(periodoVigente.periodoVigenteID)) {
            throw new Error('Error en la conversión de datos del periodo vigente');
          }

          return periodoVigente;
        })
      );
  }

  private parseNumber(value: any): number {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    throw new Error(`Unable to parse value: ${value}`);
  }

  habilitarPeriodo(periodoVigente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/HabilitarPeriodo`, periodoVigente);
  }

  verPeriodos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/VerPeriodos`);
  }
}

