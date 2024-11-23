import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = 'https://localhost:7099/api/Estudiantes'; // Reemplaza con la URL correcta de tu API

  constructor(private http: HttpClient) { }

  getEstudiantes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Consultar`);
  }

  getEstudiante(cc: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Consultar?CC=${cc}`);
  }

  insertarEstudiante(estudiante: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Insertar`, estudiante);
  }

  actualizarEstudiante(estudiante: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Actualizar`, estudiante);
  }

  eliminarEstudiante(cc: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Eliminar?CC=${cc}`);
  }

  getGrados(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/grados`);
  }
}