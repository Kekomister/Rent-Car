import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { CrearCuentaComponent } from './pages/crear-cuenta/crear-cuenta.component';
import { AdministrarComponent } from './pages/administrar/administrar.component';
import { RentarComponent } from './pages/rentar/rentar.component';
import { CcSucursalesComponent } from './pages/cc-sucursales/cc-sucursales.component';
import { PeticionesComponent } from './pages/peticiones/peticiones.component';

const routes: Routes = [
  {path : "", component : InicioComponent},
  {path : "Sign-Up", component : CrearCuentaComponent},
  {path : "Administrar", component : AdministrarComponent},
  {path : "Rentar/:id/:peticion", component : RentarComponent},
  {path : "Crear-cambiar-sucursal", component : CcSucursalesComponent},
  {path : 'Peticiones', component : PeticionesComponent},
  {path: '**',component: InicioComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
