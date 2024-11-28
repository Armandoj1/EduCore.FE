import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  usuario: string;
  role: string;
  nombreRol: string;
  // Nuevos campos añadidos
  cc?: string;
  nombreCompleto?: string;
  fechaNacimiento?: string;
  direccion?: string;
  telefono?: string;
  edad?: number;
  correo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SharedUserService {
  private userNameSource = new BehaviorSubject<string>('');
  currentUserName = this.userNameSource.asObservable();

  private userIdSource = new BehaviorSubject<string>('');
  currentUserId = this.userIdSource.asObservable();

  private periodoVigenteSource = new BehaviorSubject<number | null>(null);
  currentPeriodoVigente = this.periodoVigenteSource.asObservable();

  private userRoleSource = new BehaviorSubject<string>('');
  currentUserRole = this.userRoleSource.asObservable();

  private userDataSource = new BehaviorSubject<User | null>(null);
  currentUserData = this.userDataSource.asObservable();

  constructor() { }

  changeUserName(userName: string) {
    console.log('Cambiando nombre de usuario a:', userName);
    this.userNameSource.next(userName);
  }

  changeUserId(userId: string) {
    console.log('Cambiando ID de usuario a:', userId);
    this.userIdSource.next(userId);
  }

  changeUserRole(userRole: string) {
    console.log('Cambiando rol de usuario a:', userRole);
    this.userRoleSource.next(userRole);
  }

  setUserData(user: User | null) {
    console.log('Estableciendo datos de usuario:', user);
    this.userDataSource.next(user);
    if (user) {
      this.changeUserName(user.usuario);
      this.changeUserId(user.id.toString());
      this.changeUserRole(user.nombreRol);
    } else {
      this.clearUserData();
    }
  }

  clearUserData() {
    this.userDataSource.next(null);
    this.changeUserName('');
    this.changeUserId('');
    this.changeUserRole('');
  }

  getUserData(): User | null {
    return this.userDataSource.getValue();
  }

  setPeriodoVigente(periodoId: number) {
    console.log('Estableciendo período vigente:', periodoId);
    this.periodoVigenteSource.next(periodoId);
    localStorage.setItem('periodoVigente', periodoId.toString());
  }

  getPeriodoVigente(): number | null {
    const savedPeriodo = localStorage.getItem('periodoVigente');
    return savedPeriodo ? parseInt(savedPeriodo, 10) : null;
  }


}

