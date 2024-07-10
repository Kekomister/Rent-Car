import { Component, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { Usuario } from 'src/app/classes/usuario.model';
import { ConexionService } from 'src/app/services/conexion.service';
import { LoginService } from 'src/app/services/login.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usuario: string = "";
  contrasenia: string = "";
  @Output() evtIr: EventEmitter<any> = new EventEmitter<any>();
  @Output() evtSalir: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private login: LoginService,
    private conexion: ConexionService,
    private alert: MessagesService,
    private renderer: Renderer2
  ) { 
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        e.target == document.getElementById('fondo-login')
      ) {
        //console.log("FUERA DE LOGIN");
        this.login.logeando = false;
        this.salir();
      }
    });
  }

  public chequeoEntrar() {
    let uFlag = false;
    let cFlag = false;

    let doc = this.traerDocId("login-usuario");
    if (this.usuario == "") {
      uFlag = true;
      this.seteoBorder(doc, "red");
    } else {
      this.seteoBorder(doc, "black");
    }

    doc = this.traerDocId("login-contrasenia");
    if (this.contrasenia == "") {
      cFlag = true;
      this.seteoBorder(doc, "red");
    } else {
      this.seteoBorder(doc, "black");
    }

    doc = this.traerDocId("login-error");
    if (!uFlag && !cFlag) {
      this.preguntaEntrar();
      doc.hidden = true;
    } else {
      doc.hidden = false;
    }
  }

  public salir() {
    this.limpiar();
    this.evtSalir.emit();
  }

  public irA(donde: string) {
    this.evtIr.emit(donde);
  }

  private preguntaEntrar() {
    if (this.login.chequeoMasterAdmin(this.usuario, this.contrasenia)) {
      this.alert.mensajeBien("Bienvenido Duenio!");
      this.irA('Crear-cambiar-sucursal');
      this.login.usuario.nombre_usuario = "M";
      this.login.logeando = false;
    }
    else {
      let user = this.chequeaUsuario(this.conexion.lista_Usuarios);
      if (user.id_usuario == undefined) {
        this.alert.error("El nombre de usuario o contraseña es incorrecto");
      }
      else {
        let mensaje = "Sesion iniciada correctamente"
        this.login.logeando = false;
        let duenio = this.chequeoduenio(user);
        if (duenio != -1) {
          this.login.duenio = duenio;
          mensaje += " como encargado"
        }
        this.login.usuario = user;
        this.alert.mensajeBien(mensaje);
      }
    }
  }

  private chequeaUsuario(array: Usuario[]): Usuario {
    let encontrado: Usuario = new Usuario;

    array.forEach(usuario => {
      if (usuario.nombre_usuario == this.usuario && usuario.contrasenia == this.contrasenia) {
        encontrado = usuario;
      }
    });

    return encontrado;
  }

  private chequeoduenio(user: Usuario) {
    let esta = -1;
    for (let i = 0; i < this.conexion.lista_Sucursales.length && esta == -1; i++) {
      let scsal = this.conexion.lista_Sucursales[i];
      if (scsal.duenio == user.id_usuario) {
        esta = scsal.id_sucursal;
        this.login.sucursal = scsal.ciudad;
      }
    }
    return esta;
  }

  private traerDocId(id: string) {
    return document.getElementById(id) as HTMLElement;
  }

  private seteoBorder(doc: HTMLElement, color: string) {
    doc.style.border = "1px solid " + color;
  }

  private limpiar() {
    let doc = this.traerDocId("login-usuario");
    this.seteoBorder(doc, "black");

    doc = this.traerDocId("login-contrasenia");
    this.seteoBorder(doc, "black");

    doc = this.traerDocId("login-error");
    doc.hidden = true;

    this.usuario = "";
    this.contrasenia = "";
  }

}
