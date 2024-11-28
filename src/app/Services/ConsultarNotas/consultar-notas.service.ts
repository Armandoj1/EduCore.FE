import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConsultarNotas {
  EstudianteCC?: string;
  GradoID?: number;
  MateriaID?: string;
}

export interface ListadoUtilidades {
  CC?: string;
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
export class ConsultarNotasService {
  private apiUrl = 'https://localhost:7099/api/ConsultarNotas'; // Ajusta esta URL según tu configuración

  constructor(private http: HttpClient) { }

  consultarNotasEstudiantes(estudianteCC?: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarNotasEstudiantes`, { params: { EstudianteCC: estudianteCC || '' } });
  }

  consultarNotasGrados(gradoID: number = 0, materiaID?: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarNotasGrados`, { params: { GradoID: gradoID.toString(), MateriaID: materiaID || '' } });
  }

  consultarNotasGradosID(gradoID: number = 0, materiaID?: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarNotasGradosID`, { params: { GradoID: gradoID.toString(), MateriaID: materiaID || '' } });
  }

  consultarGradosDocentes(docenteCC?: string): Observable<ApiResponse> {
    console.log('Consultando grados para el docente:', docenteCC);
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarGradosDocentes`, { params: { DocenteCC: docenteCC || '' } });
  }

  consultarMateriasDocentes(docenteCC?: string): Observable<ApiResponse> {
    console.log('Consultando materias para el docente:', docenteCC);
    return this.http.get<ApiResponse>(`${this.apiUrl}/ConsultarMateriasDocentes`, { params: { DocenteCC: docenteCC || '' } });
  }
}

