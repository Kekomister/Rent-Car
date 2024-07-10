import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { CartaComponent } from './components/carta/carta.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CrearCuentaComponent } from './pages/crear-cuenta/crear-cuenta.component';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdministrarComponent } from './pages/administrar/administrar.component';
import { ButtonModule } from 'primeng/button';
import { RentarComponent } from './pages/rentar/rentar.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CcSucursalesComponent } from './pages/cc-sucursales/cc-sucursales.component';
import { TableComponent } from './components/table/table.component';
import {TableModule} from 'primeng/table';
import { PeticionesComponent } from './pages/peticiones/peticiones.component';
import { AutosReducidoPipe } from './pipes/autos-reducido.pipe';
import { ResetAutosPipe } from './pipes/reset-autos.pipe';
import { EsperaComponent } from './components/espera/espera.component';
import { BooleanPipe } from './pipes/boolean.pipe';
import { NoRentadosPipe } from './pipes/no-rentados.pipe';
import { RandomPipe } from './pipes/random.pipe';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    CartaComponent,
    CrearCuentaComponent,
    AdministrarComponent,
    RentarComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    CcSucursalesComponent,
    TableComponent,
    PeticionesComponent,
    AutosReducidoPipe,
    ResetAutosPipe,
    EsperaComponent,
    BooleanPipe,
    NoRentadosPipe,
    RandomPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CalendarModule,
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    TableModule
  ],
  providers: [NoRentadosPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
