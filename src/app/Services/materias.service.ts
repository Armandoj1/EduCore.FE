import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Materia {
  materiaID: string;
  nombreMateria: string;
  gradoID: number;
  nombreGrado: string;
}

export interface MateriaInsertDTO {
  materiaID: string;
  gradoID: number;
}

export interface MateriaUpdateDTO {
  materiaID: string;
  gradoID: number;
  nuevaMateriaID: string;
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
export class MateriasService {
  private apiUrl = 'https://localhost:7099/api/GradosMaterias';

  constructor(private http: HttpClient) { }

  getMaterias(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Consultar`);
  }

  getMateria(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Consultar?ID=${id}`);
  }

  insertarMateria(materia: MateriaInsertDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Insertar`, materia);
  }

  actualizarMateria(materia: MateriaUpdateDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/Actualizar`, materia);
  }

  eliminarMateria(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/Eliminar?ID=${id}`);
  }

  getListaMaterias(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarMaterias`);
  }

  getListaGrados(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarGrados`);
  }
}
