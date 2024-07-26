import { Injectable } from '@angular/core';

import { UsuarioService } from './usuario.service';
import { SucursalService } from './sucursal.service';
import { PeticionService } from './peticion.service';
import { AutoService } from './auto.service';
import { AutoSucursalService } from './auto-sucursal.service';
import { Usuario } from '../classes/usuario.model';
import { Sucursal } from '../classes/sucursal.model';
import { Auto } from '../classes/auto.model';
import { Auto_Sucursal } from '../classes/auto_sucursal.model';
import { Peticion } from '../classes/peticion.model';

import { of } from 'rxjs';
import { MailService } from './mail.service';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  lista_Usuarios: Usuario[] = [];
  lista_Sucursales: Sucursal[] = [];
  lista_Autos: Auto[] = [];
  lista_Auto_Suc: Auto_Sucursal[] = [];
  lista_Peticiones: Peticion[] = [];

  lista_Marcas: String[] = [];

  conectado : boolean = false;

  constructor(
    public usuario: UsuarioService,
    public sucursal: SucursalService,
    public peticion: PeticionService,
    public auto: AutoService,
    public auto_suc: AutoSucursalService,
    public mail: MailService
  ) { }

  async refresh_BD() {
      this.usuario.traerUsuarios().subscribe(async res => {
        this.lista_Usuarios = await res;
        this.mensaje("USUARIOS : ", this.lista_Usuarios);
      });

      this.sucursal.traerSucursales().subscribe(async res => {
        this.lista_Sucursales = await res;
        this.mensaje("SUCURSALES : ", this.lista_Sucursales);
      });

      this.auto.traerAutos().subscribe(async res => {
        this.lista_Autos = await res;
        this.mensaje("AUTOS : ", this.lista_Autos);
        this.sacarMarcas();
      });

      this.auto_suc.traerAuto_Sucursales().subscribe(async res => {
        this.lista_Auto_Suc = await res;
        this.mensaje("AUTO_SUCURSALES : ", this.lista_Auto_Suc);
      });

      this.peticion.traerPeticiones().subscribe(async res => {
        this.lista_Peticiones = await res;
        this.mensaje("PETICIONES : ", this.lista_Peticiones);
        this.finalizado(this.lista_Peticiones);
      });
      
  }

  private mensaje(msj : string, array : any){
    console.log(msj);
    console.log(array);
  }

  private finalizado(array : Peticion[]){
    let fecha = new Date();
    array.forEach(pet => {
      if(pet.finalizado == false){
        let f = this.fechaFormat(pet.fecha_devolucion);
        if(this.fechaExpirada(f, fecha)){
          this.peticion.finalizarPeticion(pet.id_peticion)
          .subscribe(res => {
            pet.finalizado = true;
          });
        }
      }
    })
  }

  private fechaFormat(fecha : any){
    return formatDate(fecha, 'yyyy-MM-dd', 'en-us');
  }

  private fechaExpirada(fechaPet : string, fechaAct : Date) : boolean{
    let diaAct = fechaAct.getDate();
    let diaPet = Number(fechaPet.slice(8,10));
    let mesAct = fechaAct.getMonth()+1;
    let mesPet = Number(fechaPet.slice(5,7));
    let anioAct = fechaAct.getFullYear();
    let anioPet = Number(fechaPet.slice(0,4));

    let expiro = false;
    
    if(anioAct > anioPet){
      expiro = true;
    }else{
      if(anioAct == anioPet){
        if(mesAct > mesPet){
          expiro = true;
        }else{
          if(mesAct == mesPet){
            if(diaAct > diaPet){
              expiro = true;
            }
          }
        }
      }
    }
    return expiro;
  }

  private sacarMarcas(){
    this.lista_Marcas = [];

    this.lista_Autos.forEach(ato => {
      let esta = false;
      for(let i = 0; i < this.lista_Marcas.length && !esta; i++){
        if(this.lista_Marcas[i] == ato.marca){
          esta = true;
        }
      }
      if(!esta){
        this.lista_Marcas.push(ato.marca);
      }
    });

    this.mensaje("MARCAS : ", this.lista_Marcas);
  }

}
