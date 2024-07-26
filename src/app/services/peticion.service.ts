import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Peticion } from '../classes/peticion.model';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class PeticionService {

  urlPeticion: string = this.backend.url + "/usuario/peticion";
  // NECESITA EL NUMERO DEL USUARIO QUE HACE LA PETICION
  //urlPeticion: string = "http://localhost:3000/usuario/peticion";

  constructor(private http : HttpClient, private backend: BackendService) { }

  public traerPeticiones(){
    return this.http.get<Peticion[]>(this.urlPeticion);
  }

  public crearPeticion(peticion : Peticion){
    return this.http.post<Peticion>(this.urlPeticion,peticion);
  }

  public modificarPeticion(id : number, sucursal : number){
    return this.http.put(this.urlPeticion + "/" + id, 
    {sucursal_devolucion : sucursal});
  }

  public finalizarPeticion(id : number){
    return this.http.put(this.urlPeticion + "/fin/" + id, 
    {finalizado : 1});
  }

  public borrarPeticion(id : number){
    return this.http.delete(this.urlPeticion + "/" + id);
  }
}
