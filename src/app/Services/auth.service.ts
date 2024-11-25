import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { SharedUserService } from './shared-user.service';

export interface User {
  id: number;
  usuario: string;
  contrasena: string;
  role: string;
  nombreRol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7099/api/Usuario';

  constructor(
    private http: HttpClient,
    private sharedUserService: SharedUserService
  ) {}

  verifyUser(usuario: string, contrasena: string): Observable<User | null> {
    const params = new HttpParams()
      .set('usuario', usuario)
      .set('contrasena', contrasena);

    return this.http.get<any>(`${this.apiUrl}/Consultar`, { params })
      .pipe(
        tap(response => console.log('Respuesta del servidor (raw):', JSON.stringify(response))),
        map(response => {
          console.log('Tipo de respuesta:', typeof response);
          console.log('Es array:', Array.isArray(response));
          
          let userData;
          if (Array.isArray(response.resultadoConsulta) && response.resultadoConsulta.length > 0) {
            userData = response.resultadoConsulta[0];
          } else if (typeof response.resultadoConsulta === 'object' && response.resultadoConsulta !== null) {
            userData = response.resultadoConsulta;
          }

          if (userData && userData.usuario === usuario && userData.contrasena === contrasena) {
            console.log('Datos del usuario encontrados:', JSON.stringify(userData));
            const user: User = {
              id: parseInt(userData.usuario), // Asumiendo que el ID es el mismo que el usuario
              usuario: userData.usuario,
              contrasena: userData.contrasena,
              role: userData.nombreRol,
              nombreRol: userData.nombreRol
            };
            console.log('Usuario procesado:', JSON.stringify(user));
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.sharedUserService.setUserData(user);
            return user;
          } else {
            console.log('No se encontró el usuario o las credenciales son incorrectas');
            return null;
          }
        }),
        catchError(error => {
          console.error('Error en la autenticación:', error);
          return of(null);
        })
      );
  }

  getCurrentUser(): User | null {
    const userString = localStorage.getItem('currentUser');
    const user = userString ? JSON.parse(userString) : null;
    console.log('Usuario actual recuperado de localStorage:', user);
    if (user) {
      this.sharedUserService.setUserData(user);
    }
    return user;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.sharedUserService.clearUserData();
    console.log('Usuario desconectado, localStorage limpiado');
  }
}

