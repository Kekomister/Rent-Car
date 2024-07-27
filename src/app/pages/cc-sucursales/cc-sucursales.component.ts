import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Columna } from 'src/app/classes/columna.model';
import { Sucursal } from 'src/app/classes/sucursal.model';
import { Usuario } from 'src/app/classes/usuario.model';
import { ConexionService } from 'src/app/services/conexion.service';
import { LoginService } from 'src/app/services/login.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-cc-sucursales',
  templateUrl: './cc-sucursales.component.html',
  styleUrls: ['./cc-sucursales.component.css']
})
export class CcSucursalesComponent {

  titulos: Columna[] = [
    { field: "id_sucursal", header: "ID" },
    { field: "ciudad", header: "Ciudad" },
    { field: "duenio", header: "Encargado" },
    { field: "nombre", header: "Nombre del encargado" },
    { field: "apellido", header: "Apellido del encargado" },
    { field: "nombre_usuario", header: "Usuario del encargado" },
    { field: "mail", header: "Email del encargado" }
  ];

  usuarios: Usuario[] = [];
  sucursales: Sucursal[] = [];

  crear: boolean = false;
  reemplazar: boolean = false;

  tempSucursal: Sucursal = new Sucursal();
  nuevoDuenio: Usuario = new Usuario();

  constructor(
    private login: LoginService,
    private router: Router,
    private conexion: ConexionService,
    private alert: MessagesService
  ) { }

  ngOnInit() {
    if (this.login.usuario.id_usuario != -1) {
      this.router.navigate(['']);
    } else {
      this.llenarMisArrays();
    }
  }

  public crearSuc() {
    this.goBack();
    this.crear = true;
  }

  public subirSucursal() {
    //console.log(this.tempSucursal);
    if (this.chequeos()) {
      let encargado = this.conexion.lista_Usuarios.find(us => us.id_usuario == this.tempSucursal.duenio)
      let datosSuc = "Datos de la sucursal " +
        "<br> Ciudad donde esta/ra situada: " + this.tempSucursal.ciudad +
        "<br> Encargado de la sucursal: " + encargado?.nombre_usuario;

      this.alert.pregunta("Los datos estan bien?", datosSuc)
        .then(res => {
          if (res.isConfirmed) {
            this.conexion.sucursal.
              crearSucursal(this.tempSucursal).
              subscribe(() => {
                this.alert.mensajeBien("Agregada correctamente!");
                this.conexion.refresh_BD();
                this.llenarMisArrays();
              });
          } else {
            this.alert.cancelado();
          }
        })
    }
  }

  public goBack() {
    this.tempSucursal = new Sucursal();
    this.crear = false;
    this.reemplazar = false;
    this.tempSucursal = new Sucursal();
    this.nuevoDuenio = new Usuario();
  }

  public acciones(accion: any) {
    console.log(accion);
    this.goBack();
    let msg = "";
    let datosSuc = "Datos de la sucursal " +
      "<br> ID de la sucursal: " + accion[1].id_sucursal +
      "<br> Ciudad donde esta situada: " + accion[1].ciudad +
      "<br> Encargado de la sucursal: " + accion[1].nombre_usuario;

    if (accion[0] == 'borrar') {
      msg = this.sucTieneAutos(accion[1]);
      if (msg == "") {
        this.alert.pregunta("Esta seguro de borrar esta sucursal?", datosSuc)
          .then(res => {
            if (res.isConfirmed) {
              this.conexion.sucursal
                .borrarSucursal(accion[1].id_sucursal)
                .subscribe(() => {
                  this.alert.borrado();
                  this.conexion.refresh_BD();
                  this.llenarMisArrays();
                })
            } else {
              this.alert.cancelado();
            }
          })
      } else {
        this.alert.mensajeInfo(msg);
      }
    } else {
      if (accion[0] == 'modificar') {
        this.tempSucursal = accion[1];
        this.reemplazar = true;
      }
    }
  }

  public subirNuevoDuenio() {
    if(this.nuevoDuenio.nombre == undefined){
      this.alert.error("Seleccione un nuevo encargado");
    }else{
      let msj = this.chequeoDuenioDoble(this.nuevoDuenio.id_usuario);
      if (msj == "") {
        this.alert.pregunta(
          "Estas seguro de cambiar el encargado de la sucursal " + this.tempSucursal.ciudad,
          "Encargado actual: " + this.tempSucursal.nombre_usuario +
          "<br> Nuevo encargado: " + this.nuevoDuenio.nombre_usuario)
          .then(res => {
            if (res.isConfirmed) {
              this.conexion.sucursal
                .modificarSucursal(this.tempSucursal.id_sucursal, this.nuevoDuenio)
                .subscribe(() => {
                  this.alert.mensajeBien("Encargado cambiado correctamente!");
                  this.conexion.refresh_BD();
                  this.llenarMisArrays();
                })
            } else {
              this.alert.cancelado();
            }
          })
      } else {
        this.alert.error(msj);
      }
    }
  }

  private chequeos(): boolean {
    let limpio = false;
    let msj = this.chequeoVacios();
    if (msj == "") {
      msj = this.chequeoDuenioDoble(this.tempSucursal.duenio);
      if (msj == "") {
        limpio = true;
      }
    }
    if (!limpio) {
      this.alert.error(msj);
    }
    return limpio;
  }

  private chequeoVacios(): string {
    let msj = "";
    if (this.tempSucursal.duenio == undefined) {
      msj = "Tiene que seleccionar un encargado. <br>"
    }
    if (this.tempSucursal.ciudad == undefined) {
      msj += "El nombre de la ciudad esta vacio."
    }
    return msj;
  }

  private chequeoDuenioDoble(id: number): string {
    let msj = "";
    for (let i = 0; i < this.sucursales.length && msj == ""; i++) {
      if (id == this.sucursales[i].duenio) {
        msj = "Esta persona ya es encargado de otra sucursal.";
      }
    }
    return msj;
  }

  private llenarMisArrays() {
    this.limpiar();
    this.conexion.refresh_BD();
    new Promise(resolve => {
      setTimeout(() => {
        //resolve("\t\t This is first promise");
        this.usuarios = this.conexion.lista_Usuarios;
        this.sucursales = this.conexion.lista_Sucursales;
        //console.log("Usuarios : ");
        //console.log(this.usuarios);
        this.conexion.conectado = true;
      }, this.conexion.timeout);
    });
  }

  private limpiar() {
    this.conexion.conectado = false;
    this.crear = false;
    this.reemplazar = false;

    this.tempSucursal = new Sucursal();
    this.nuevoDuenio = new Usuario();
  }

  private sucTieneAutos(suc: Sucursal): string {
    let array = this.conexion.lista_Auto_Suc;
    let tiene = "";
    for (let i = 0; i < array.length && tiene == ""; i++) {
      if (array[i].id_sucursal_actual == suc.id_sucursal) {
        tiene = "No se pudo borrar porque la sucursal tiene autos adentro.";
      }
    }
    return tiene;
  }

}
