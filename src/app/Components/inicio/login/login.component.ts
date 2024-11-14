import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(private router: Router) {}

  onSubmit() {
    // Here you would typically handle the login logic
    console.log('Login attempt', this.email, this.password, this.rememberMe);
    // For now, we'll just navigate to the inicio/bienvenida route
    this.router.navigate(['/inicio/bienvenida']);
  }
}