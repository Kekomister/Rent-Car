import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor() { }

  public mensajeBien(titulo : string){
    Swal.fire({
      title : titulo,
      icon : 'success',
      color: "black",
      showConfirmButton: false,
      timer: 1500
    });
  }

  public mensajeInfo(titulo : string){
    Swal.fire({
      title : titulo,
      icon : 'info',
      color: "black",
      showConfirmButton: false,
      timer: 1500
    });
  }

  public cancelado(){
    Swal.fire({
      title : "Cancelado",
      icon : 'info',
      color: "black",
      showConfirmButton: false,
      timer: 1500
    });
  }

  public borrado(){
    Swal.fire({
      title : "Borrado correctamente!",
      icon : 'success',
      color: "black",
      showConfirmButton: false,
      timer: 1500
    });
  }

  public mensajeDetallado(titulo : string, texto : string){
    Swal.fire({
      title : titulo,
      html : texto,
      icon : "success",
      color: "black",
      showConfirmButton: false,
      timer: 1500
    });
  }

  public error(texto : string){
    Swal.fire({
      title : "ERROR",
      html : texto,
      icon : "error",
      color: "black",
      
    });
  }

  public pregunta(titulo : string, texto : string){
    return Swal.fire({
      title : titulo,
      html : texto,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ok",
      cancelButtonText: "No",
      icon : "question",
      color: "black"
    });
  }
}
