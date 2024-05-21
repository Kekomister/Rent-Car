import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auto } from '../classes/auto.model';

@Injectable({
  providedIn: 'root'
})
export class AutoService {

  urlAuto: string = "http://localhost:3000/sucursal/auto";

  constructor(private http : HttpClient) { }

  public traerAutos(){
    return this.http.get<Auto[]>(this.urlAuto);
  }

  public crearAuto(formData : FormData){
    return this.http.post(this.urlAuto, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public devolverImagen(imagen : any){
    return this.http.post<any>(this.urlAuto + "/imagen", imagen, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public modificarAuto(id : number, formData : FormData){
    return this.http.put<Auto>(
      this.urlAuto + "/" + id, formData,{
        reportProgress: true,
        observe: 'events',
      }
    );
  }
}
