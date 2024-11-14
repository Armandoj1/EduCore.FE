import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private apiUrl = 'https://localhost:7099/api/Docente'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) { }

  getDocentes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Consultar`);
  }

  getDocente(cc: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Consultar?CC=${cc}`);
  }

  insertarDocente(docente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Insertar`, docente);
  }

  actualizarDocente(docente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Actualizar`, docente);
  }

  eliminarDocente(cc: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Eliminar?CC=${cc}`);
  }

  getEspecialidades(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/especialidades`);
  }

  getMaterias(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/materias`);
  }

  getGrados(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/grados`);
  }
}