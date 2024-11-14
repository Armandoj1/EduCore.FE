// especialidades.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Especialidad {
  especialidadID: number;
  docenteID: string;
  nombreCompleto: string;
  nombreEspecialidad: string;
}

export interface EspecialidadDTO {
  especialidadID: number;
  docenteID: string;
}

export interface Docente {
  docenteID: string;
  nombreCompleto: string;
}

export interface ApiResponse {
  responseCode: number;
  responseMessage: string;
  idTransactionCode: string | null;
  rowsAffected: number;
  resultadoConsulta: any[];
  totalPaginas: number;
  totalRegistros: number;
}

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {
  private apiUrl = 'https://localhost:7099/api/DocenteEspecialidad';

  constructor(private http: HttpClient) { }

  getEspecialidades(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Consultar`);
  }

  getEspecialidad(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Consultar?ID=${id}`);
  }

  insertarEspecialidad(especialidad: EspecialidadDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Insertar`, especialidad);
  }

  actualizarEspecialidad(especialidad: EspecialidadDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/Actualizar`, especialidad);
  }

  eliminarEspecialidad(id: number, docenteID: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/Eliminar?docenteID=${docenteID}&especialidadID=${id}`);
  }

  buscarDocentes(termino: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Consultar?=${termino}`);
  }

  getListaDocentes(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarDocente`);
  }

  getListaEspecialidades(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarEspecialidad`);
  }
}