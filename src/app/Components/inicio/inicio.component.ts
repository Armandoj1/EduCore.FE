import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService, User } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { SharedUserService } from '../../Services/shared-user.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  isDarkMode: boolean = false;
  isSidebarExpanded: boolean = true;
  isProfileMenuOpen: boolean = false;
  pageTitle: string = 'Inicio';
  userName: string = 'Usuario';
  userRole: string = '';
  dropdowns: { [key: string]: boolean } = {
    estudiante: false,
    docente: false
  };
  currentUser: User | null = null;
  showWelcomeMessage: boolean = false;

  constructor(
    private renderer: Renderer2, 
    private authService: AuthService, 
    private router: Router,
    private sharedUserService: SharedUserService
  ) { }
  
  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.userName = this.currentUser?.usuario || 'Usuario';
      this.userRole = this.currentUser?.nombreRol || '';
      this.sharedUserService.changeUserName(this.userName);
      this.sharedUserService.changeUserRole(this.userRole);
      this.showWelcomeMessage = true;
      setTimeout(() => {
        this.showWelcomeMessage = false;
      }, 5000);
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
    if (!this.isSidebarExpanded) {
      Object.keys(this.dropdowns).forEach(key => {
        this.dropdowns[key] = false;
      });
    }
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleDropdown(dropdown: string): void {
    if (!this.isSidebarExpanded) {
      this.isSidebarExpanded = true;
      setTimeout(() => {
        this.dropdowns[dropdown] = !this.dropdowns[dropdown];
      }, 300);
    } else {
      this.dropdowns[dropdown] = !this.dropdowns[dropdown];
    }
  }

  setPageTitle(title: string): void {
    this.pageTitle = title;
  }

  editProfile(): void {
    console.log('Editar perfil');
  }

  changePassword(): void {
    console.log('Cambiar contraseña');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  closeWelcomeMessage(): void {
    this.showWelcomeMessage = false;
  }

  isDirectivo(): boolean {
    return this.userRole === 'Directivo';
  }

  isDocente(): boolean {
    return this.userRole === 'Docente';
  }

  isEstudiante(): boolean {
    return this.userRole === 'Estudiante';
  }
}

