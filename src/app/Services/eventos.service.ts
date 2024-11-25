import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = 'https://localhost:7099/api/Evento'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) { }

  getEventos(usuarioCreadorID: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Consultar?EventoCreadorID=${usuarioCreadorID}`);
  }

  getNumeroEstudiantes(): Observable<any>{
    return this.http.get(`${this.apiUrl}/ConsultarEstudiantes`);
  }

  insertarEvento(evento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Insertar`, evento);
  }

  actualizarEvento(evento: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Actualizar`, evento);
  }

  eliminarEvento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Eliminar?EventoID=${id}`);
  }

  getListaGrados(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ConsultarGrados`);
  }

  getListaTiposEventos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ConsultarTiposEventos`);
  }
}