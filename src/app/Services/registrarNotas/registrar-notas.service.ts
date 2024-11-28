import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



export interface Nota {
  estudianteCC: string;
  materiaID: string;
  periodoID: number;
  notaValor: number;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrarNotasService {
  private apiUrl = 'https://localhost:7099/api';

  constructor(private http: HttpClient) { }

  insertarNota(nota: Nota): Observable<any> {
    return this.http.post(`${this.apiUrl}/Notas/Insertar`, nota);
  }

  actualizarNota(nota: Nota): Observable<any> {
    return this.http.put(`${this.apiUrl}/Notas/Actualizar`, nota);
  }

}

