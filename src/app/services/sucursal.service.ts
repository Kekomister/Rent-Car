import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sucursal } from '../classes/sucursal.model';
import { Usuario } from '../classes/usuario.model';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  urlSucursal: string = this.backend.url + "/sucursal";
  //urlSucursal: string = "http://localhost:3000/sucursal";

  constructor(private http : HttpClient, private backend : BackendService) { }

  public traerSucursales(){
    return this.http.get<Sucursal[]>(this.urlSucursal);
  }

  public buscarSucursal(id : number){
    return this.http.get<Sucursal>(this.urlSucursal + "/" + id);
  }

  public crearSucursal(sucursal : Sucursal){
    return this.http.post<Sucursal>(this.urlSucursal, sucursal);
  }

  public modificarSucursal(id : number, duenio : Usuario){
    return this.http.put<Sucursal>(this.urlSucursal + "/" + id, duenio);
  }

  public borrarSucursal(id : number){
    return this.http.delete(this.urlSucursal + "/" + id);
  }
}
