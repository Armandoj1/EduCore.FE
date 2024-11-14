import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Grado {
  gradoID: string;
  nombreGrado: string;
  docenteID: string;
  nombreDocente: string;
  materiaID: string;
  nombreMateria: string;
}

export interface GradoDTO {
  gradoID: string;
  docenteID: string;
  materiaID: string;

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
  providedIn: 'root',
})
export class GradosService {
  private apiUrl = 'https://localhost:7099/api/DocenteMateriasGrados';

  constructor(private http: HttpClient) {}

  LoadGrados(): Observable<Grado[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Consultar`).pipe(
      map((response) => {
        if (response && response.resultadoConsulta && Array.isArray(response.resultadoConsulta)) {
          return response.resultadoConsulta.map((item) => ({
            gradoID: item.gradoID.toString(),
            nombreGrado: item.nombreGrado,
            docenteID: item.docenteID,
            nombreDocente: item.nombreCompleto,
            materiaID: item.materiaID,
            nombreMateria: item.nombreMateria,
          }));
        }
        return [];
      })
    );
  }

  comboboxGrados(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarGrados`);
  }

  comboboxDocente(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarDocente`);
  }

  comboboxMateria(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarMaterias`);
  }

  createGrado(grado: GradoDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/Insertar`, grado);
  }

  updateGrado(grado: GradoDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/Actualizar/${grado.gradoID}`, grado);
  }

  deleteGrado(gradoID: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Eliminar/${gradoID}`);
  }
}
