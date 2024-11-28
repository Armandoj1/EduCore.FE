import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService, User } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { SharedUserService } from '../../Services/shared-user.service';
import { DatosPersonalesService, ActualizarDatosUsuario } from '../../Services/DatosPersonales/datos-personales.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  isDarkMode: boolean = false;
  isSidebarExpanded: boolean = true;
  isProfileMenuOpen: boolean = false;
  isEditProfileOpen: boolean = false;
  isChangePasswordOpen: boolean = false;
  pageTitle: string = 'Inicio';
  userName: string = 'Usuario';
  userRole: string = '';
  dropdowns: { [key: string]: boolean } = {
    estudiante: false,
    docente: false
  };
  currentUser: User | null = null;
  showWelcomeMessage: boolean = false;

  editProfileData: Partial<User> = {
    cc: '',
    nombreCompleto: '',
    direccion: '',
    correo: '',
    telefono: '',
    fechaNacimiento: '',
    edad: 0
  };

  changePasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private renderer: Renderer2, 
    private authService: AuthService, 
    private router: Router,
    private sharedUserService: SharedUserService,
    private datosPersonalesService: DatosPersonalesService
  ) { }
  
  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.userName = this.currentUser?.nombreCompleto || this.currentUser?.usuario || 'Usuario';
      this.userRole = this.currentUser?.nombreRol || '';
      this.sharedUserService.changeUserName(this.userName);
      this.sharedUserService.changeUserRole(this.userRole);
      this.showWelcomeMessage = true;
      setTimeout(() => {
        this.showWelcomeMessage = false;
      }, 5000);

      if (this.currentUser) {
        this.editProfileData = {
          cc: this.currentUser.cc,
          nombreCompleto: this.currentUser.nombreCompleto,
          direccion: this.currentUser.direccion,
          correo: this.currentUser.correo,
          telefono: this.currentUser.telefono,
          fechaNacimiento: this.currentUser.fechaNacimiento ? new Date(this.currentUser.fechaNacimiento).toISOString().split('T')[0] : '',
          edad: this.currentUser.edad
        };
      }
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
    this.isEditProfileOpen = true;
    this.isProfileMenuOpen = false;
  }

  updateProfile(): void {
    if (confirm('¿Está seguro que desea actualizar la información?')) {
      const updatedData: ActualizarDatosUsuario = {
        cc: this.editProfileData.cc || '',
        nombreCompleto: this.editProfileData.nombreCompleto || '',
        direccion: this.editProfileData.direccion || '',
        correo: this.editProfileData.correo || '',
        telefono: this.editProfileData.telefono || '',
        fechaNacimiento: this.editProfileData.fechaNacimiento || ''
      };

      console.log('Datos a enviar:', updatedData);

      this.datosPersonalesService.actualizarDatosPersonales(updatedData).subscribe(
        response => {
          console.log('Profile updated successfully', response);
          if (this.currentUser) {
            this.currentUser = { ...this.currentUser, ...updatedData };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.userName = this.currentUser.nombreCompleto || this.currentUser.usuario || 'Usuario';
            this.sharedUserService.changeUserName(this.userName);
            this.isEditProfileOpen = false;
          }
        },
        error => {
          console.error('Error updating profile', error);
          // Handle error (show message to user, etc.)
        }
      );
    }
  }

  cancelEditProfile(): void {
    this.isEditProfileOpen = false;
  }

  changePassword(): void {
    this.isChangePasswordOpen = true;
    this.isProfileMenuOpen = false;
  }

  updatePassword(): void {
    if (this.changePasswordData.newPassword !== this.changePasswordData.confirmPassword) {
      alert('Las contraseñas nuevas no coinciden');
      return;
    }

    if (!this.currentUser || !this.currentUser.cc) {
      alert('Error: No se pudo obtener la información del usuario');
      return;
    }

    const passwordData = {
      cc: this.currentUser.cc,
      contrasenaActual: this.changePasswordData.currentPassword,
      contrasena: this.changePasswordData.newPassword
    };

    console.log('Datos de cambio de contraseña a enviar:', passwordData);

    this.datosPersonalesService.actualizarContrasena(passwordData).subscribe(
      response => {
        console.log('Password updated successfully', response);
        this.isChangePasswordOpen = false;
        this.changePasswordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        alert('Contraseña actualizada con éxito');
      },
      error => {
        console.error('Error updating password', error);
        let errorMessage = 'Error al actualizar la contraseña. ';
        if (error.error && error.error.responseMessage) {
          errorMessage = error.error.responseMessage;
        } else {
          errorMessage += 'Por favor, inténtelo de nuevo.';
        }
        alert(errorMessage);
      }
    );
  }

  cancelChangePassword(): void {
    this.isChangePasswordOpen = false;
    this.changePasswordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
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