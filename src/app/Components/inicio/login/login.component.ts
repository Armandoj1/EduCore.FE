import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../Services/auth.service';
import { SharedUserService } from '../../../Services/shared-user.service';
import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations:  [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('slideInFromBottom', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
    trigger('pulseAnimation', [
      transition('* => *', [
        animate('2s ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.05)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 }),
        ])),
      ]),
    ]),
    trigger('staggeredFade', [
      transition(':enter', [
        query('.stagger-item', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ]),
      ]),
    ]),
  ],
})

export class LoginComponent implements OnInit {
  usuario: string = '';
  contrasena: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private sharedUserService: SharedUserService
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Enviando solicitud de inicio de sesión con datos:', { usuario: this.usuario, contrasena: this.contrasena });

    this.authService.verifyUser(this.usuario, this.contrasena).subscribe(
      (user: User | null) => {
        this.isLoading = false;
        console.log('Respuesta recibida:', user);

        if (user) {
          console.log('Inicio de sesión exitoso', user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['/inicio']);

          // Mostrar todos los datos del usuario capturados
          console.log('Datos completos del usuario:', this.sharedUserService.getUserData());
        } else {
          this.errorMessage = 'Usuario o contraseña inválidos';
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error de inicio de sesión', error);
        this.errorMessage = 'Ocurrió un error durante el inicio de sesión';
      }
    );
  }
}

