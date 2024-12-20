import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './Components/inicio/inicio.component';
import { BienvenidaComponent } from './Components/inicio/bienvenida/bienvenida.component';
import { LoginComponent } from './Components/inicio/login/login.component';
import { GestionNotasComponent } from './Components/inicio/gestion-notas/gestion-notas.component';
import { GestionEstudianteComponent } from './Components/inicio/gestion-estudiante/gestion-estudiante.component';
import { GestionDocenteComponent } from './Components/inicio/gestion-docente/gestion-docente.component';
import { GestionGradosComponent } from './Components/inicio/gestion-grados/gestion-grados.component';
import { GestionMateriasComponent } from './Components/inicio/gestion-materias/gestion-materias.component';
import { EspecialidadesComponent } from './Components/inicio/especialidades/especialidades.component';
import { GradosEstudiantesComponent } from './Components/inicio/grados-estudiantes/grados-estudiantes.component';
import { EventosComponent } from './Components/inicio/eventos/eventos.component';
import { ConsultarNotasComponent } from './Components/inicio/consultar-notas/consultar-notas.component';
import { MisNotasComponent } from './Components/inicio/mis-notas/mis-notas.component';
import { RegistrarNotasComponent } from './Components/inicio/registrar-notas/registrar-notas.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, // Ruta separada para el login
  {
    path: 'inicio', component: InicioComponent, children: [
      { path: '', component: BienvenidaComponent },
      { path: 'bienvenida', component: BienvenidaComponent },
      { path: 'Notas', component: GestionNotasComponent },
      { path: 'Estudiante', component: GestionEstudianteComponent },
      { path: 'Docente', component: GestionDocenteComponent },
      { path: 'Grados', component: GestionGradosComponent },
      { path: 'Materias', component: GestionMateriasComponent },
      { path: 'Especialidades', component: EspecialidadesComponent},
      { path: 'GradosEstudiantes', component: GradosEstudiantesComponent},
      { path: 'Eventos', component: EventosComponent},
      { path: 'ConsultarNotas', component: ConsultarNotasComponent},
      { path: 'MisNotas', component: MisNotasComponent},
      { path: 'RegistrarNotas', component: RegistrarNotasComponent}
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
