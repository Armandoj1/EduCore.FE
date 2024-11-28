import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedUserService } from '../shared-user.service';
import { tap } from 'rxjs/operators';

export interface ActualizarDatosUsuario {
  cc: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  correo: string;
  telefono: string;
  direccion: string;
}

interface ActualizarContrasena {
  cc: string;
  contrasenaActual: string;
  contrasena: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatosPersonalesService {
  private apiUrl = 'https://localhost:7099'; // URL base de la API

  constructor(
    private http: HttpClient,
    private sharedUserService: SharedUserService
  ) {}

  private actualizarUsuario(endpoint: string, datos: ActualizarDatosUsuario): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    console.log('Full URL:', url);
    console.log('Datos a enviar:', datos);
    return this.http.put(url, datos).pipe(
      tap(
        response => console.log('Respuesta del servidor:', response),
        error => console.error('Error del servidor:', error)
      )
    );
  }

  actualizarDocente(datos: ActualizarDatosUsuario): Observable<any> {
    return this.actualizarUsuario('ActualizarDocente', datos);
  }

  actualizarDirectivo(datos: ActualizarDatosUsuario): Observable<any> {
    return this.actualizarUsuario('ActualizarDirectivo', datos);
  }

  actualizarEstudiante(datos: ActualizarDatosUsuario): Observable<any> {
    return this.actualizarUsuario('ActualizarEstudiante', datos);
  }

  actualizarContrasena(datos: ActualizarContrasena): Observable<any> {
    return this.http.put(`${this.apiUrl}/ActualizarContrasena`, datos);
  }

  actualizarDatosPersonales(datos: ActualizarDatosUsuario): Observable<any> {
    const currentUser = this.sharedUserService.getUserData();
    if (!currentUser) {
      throw new Error('No se encontraron datos del usuario');
    }

    const userRole = currentUser.nombreRol;
    
    switch (userRole) {
      case 'Docente':
        return this.actualizarDocente(datos);
      case 'Directivo':
        return this.actualizarDirectivo(datos);
      case 'Estudiante':
        return this.actualizarEstudiante(datos);
      default:
        throw new Error('Rol de usuario no reconocido');
    }
  }
}

