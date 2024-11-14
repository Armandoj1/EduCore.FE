import { Component, OnInit, Renderer2 } from '@angular/core';

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
  dropdowns: { [key: string]: boolean } = {
    estudiante: false,
    docente: false
  };

  constructor(private renderer: Renderer2) { }
  
  ngOnInit(): void {
    // Initialization logic if needed
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
      }, 300); // Delay to match the sidebar expansion animation
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
    console.log('Cerrar sesión');
  }
}