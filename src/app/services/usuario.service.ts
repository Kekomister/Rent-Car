import { Injectable } from '@angular/core';
import { Usuario } from '../classes/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlUsuario = `${environment.apiUrl}/usuario`;
  //urlUsuario: string = "http://localhost:3000/usuario";

  constructor(private http : HttpClient) { }

  public traerUsuarios(){
    return this.http.get<Usuario[]>(this.urlUsuario);
  }

  public crearUsuario(usuario : Usuario){
    return this.http.post<Usuario>(this.urlUsuario, usuario);
  }

}
