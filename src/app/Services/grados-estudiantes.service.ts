import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GradoEstudiante {
  gradoID: number;
  estudianteCC: string;
  nombreCompleto: string;
  nombreGrado: string;
}

export interface GradoEstudianteDTO {
  gradoID: number;
  estudianteCC: string;
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
export class GradosEstudiantesService {
  private apiUrl = 'https://localhost:7099/api/EstudiantesGrados';

  constructor(private http: HttpClient) { }

  getGradosEstudiantes(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Consultar`);
  }

  getGradoEstudiante(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Consultar?ID=${id}`);
  }

  insertarGradoEstudiante(gradoEstudiante: GradoEstudianteDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Insertar`, gradoEstudiante);
  }

  actualizarGradoEstudiante(gradoEstudiante: GradoEstudianteDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/Actualizar`, gradoEstudiante);
  }

  eliminarGradoEstudiante(id: number, estudianteCC: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/Eliminar?estudianteCC=${estudianteCC}&gradoID=${id}`);
  }

  getListaEstudiantes(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarEstudiantes`);
  }

  getListaGrados(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarGrados`);
  }
}