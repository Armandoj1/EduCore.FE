import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    // Cargar notificaciones guardadas al iniciar
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      this.notificationsSubject.next(JSON.parse(savedNotifications));
    }
  }

  updateNotifications(events: any[]): void {
    this.notificationsSubject.next(events);
    localStorage.setItem('notifications', JSON.stringify(events));
  }

  clearNotifications(): void {
    this.notificationsSubject.next([]);
    localStorage.removeItem('notifications');
  }

  removeNotification(eventId: number): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== eventId);
    this.notificationsSubject.next(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  }
}