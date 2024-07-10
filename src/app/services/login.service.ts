import { Injectable } from '@angular/core';
import { Usuario } from '../classes/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  usuario: Usuario = new Usuario();
  duenio: number = -1;
  sucursal: string = "";
  logeando: boolean = false;

  constructor() { }

  public setInicio(){
    let temp_U = localStorage.getItem('User')!.toString();
    this.usuario = JSON.parse(temp_U);
    let temp_D = localStorage.getItem('Duenio')!.toString();
    this.duenio = Number(temp_D);
    let temp_S = localStorage.getItem('Sucursal')!.toString();
    this.sucursal = JSON.parse(temp_S);
  }

  public chequeoMasterAdmin(usuario: string, contrasenia: string) {
    let entro = false;

    if (
      usuario == "M" &&
      contrasenia == "1234"
    ) {
      this.usuario.id_usuario = -1;
      entro = true;
    }

    return entro;
  }

  public chequeoCliente(): boolean {
    return this.usuario.id_usuario != undefined;
  }

  public desconectar() {
    this.usuario = new Usuario();
    this.duenio = -1;
    this.sucursal = "";
  }
}
