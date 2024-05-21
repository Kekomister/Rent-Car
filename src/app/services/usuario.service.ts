import { Injectable } from '@angular/core';
import { Usuario } from '../classes/usuario.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  urlUsuario: string = "http://localhost:3000/usuario";

  constructor(private http : HttpClient) { }

  public traerUsuarios(){
    return this.http.get<Usuario[]>(this.urlUsuario);
  }

  public crearUsuario(usuario : Usuario){
    return this.http.post<Usuario>(this.urlUsuario, usuario);
  }

}
