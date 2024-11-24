import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: number;
  usuario: string;
  role: string;
  nombreRol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7099/api/Usuario'; // Actualizado a Usuario en singular

  constructor(private http: HttpClient) {}

  verifyUser(usuario: string, contrasena: string): Observable<User | null> {
    const params = new HttpParams()
      .set('usuario', usuario)
      .set('contrasena', contrasena);

    return this.http.get<User | null>(`${this.apiUrl}/Consultar`, { params })
      .pipe(
        map(response => response)
      );
  }

  getCurrentUser(): User | null {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }
}

