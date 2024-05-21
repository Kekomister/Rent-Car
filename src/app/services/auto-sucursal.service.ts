import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auto_Sucursal } from '../classes/auto_sucursal.model';

@Injectable({
  providedIn: 'root'
})
export class AutoSucursalService {

  urlAuto_Sucursal: string = "http://localhost:3000/sucursal/auto_sucursal";

  constructor(private http : HttpClient) { }

  public traerAuto_Sucursales(){
    return this.http.get<Auto_Sucursal[]>(this.urlAuto_Sucursal);
  }

  public crearNewAuto_Sucursal(auto_suc : Auto_Sucursal){
    return this.http.post(this.urlAuto_Sucursal, auto_suc, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public crearOldAuto_Sucursal(auto_suc : Auto_Sucursal){
    console.log(auto_suc);
    return this.http.post(this.urlAuto_Sucursal + "/" + auto_suc.id_auto, auto_suc, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public buscarAuto_Sucursal(id : number){
    return this.http.get<Auto_Sucursal>(this.urlAuto_Sucursal + "/" + id);
  }

  public modificarAuto_Sucursal(id_auto : number, id_sucursal : number){
    return this.http.put(this.urlAuto_Sucursal + "/" + id_auto, {"id_sucursal_actual" : id_sucursal});
  }

  public eliminarAuto_Sucursal(id : number){
    return this.http.delete(this.urlAuto_Sucursal + "/" + id);
  }
}
