import { FontawesomeObject } from './../../node_modules/@fortawesome/fontawesome-svg-core/index.d';
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './Components/inicio/inicio.component';
import { BienvenidaComponent } from './Components/inicio/bienvenida/bienvenida.component';
import { LoginComponent } from './Components/inicio/login/login.component';
import { RegisterComponent } from './Components/inicio/register/register.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotasComponent } from './Components/inicio/notas/notas.component';
import { GestionEstudianteComponent } from './Components/inicio/gestion-estudiante/gestion-estudiante.component';
import { GestionDocenteComponent } from './Components/inicio/gestion-docente/gestion-docente.component';
import { GestionGradosComponent } from './Components/inicio/gestion-grados/gestion-grados.component';
import { GestionNotasComponent } from './Components/inicio/gestion-notas/gestion-notas.component';
import { GestionMateriasComponent } from './Components/inicio/gestion-materias/gestion-materias.component';
import { ModelsModel } from './src/app/models/models.model';
import { EspecialidadesComponent } from './Components/inicio/especialidades/especialidades.component';



@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    BienvenidaComponent,
    LoginComponent,
    RegisterComponent,
    NotasComponent,
    GestionEstudianteComponent,
    GestionDocenteComponent,
    GestionGradosComponent,
    GestionNotasComponent,
    GestionMateriasComponent,
    ModelsModel,
    EspecialidadesComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule

  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
