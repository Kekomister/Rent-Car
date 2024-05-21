import { Component, OnInit } from '@angular/core';
import { Mail } from 'src/app/classes/mail.model';
import { Usuario } from 'src/app/classes/usuario.model';
import { ConexionService } from 'src/app/services/conexion.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.css']
})
export class CrearCuentaComponent {

  temp_usuario: Usuario = new Usuario;
  contraCopia: string = "";
  mailError : boolean = false;
  time : number = 0;

  constructor(
    private conexion: ConexionService,
    private alert: MessagesService
  ) { }

  ngOnInit() {
    this.conexion.conectado = true;
  }

  public async chequeoCampos() {
    this.mailError = false;
    let nomFlag = this.chequeoStringNum(this.temp_usuario.nombre, "nombre");
    let apeFlag = this.chequeoStringNum(this.temp_usuario.apellido, "apellido");
    let dniFlag = this.chequeoDni(this.temp_usuario.dni);
    let userFlag = this.chequeoUsuario("usuario");
    let contraFlag = this.chequeoContra("contra");
    let mailFlag = this.chequeoMail("mail");

    if(mailFlag == ""){
      this.envioMail();
      this.time = 4000;
    }

    setTimeout(() => {
      this.time = 0;
      if (this.mailError) {
        mailFlag = "El mail ingresado no es correcto o hubo un problema";
      }

      if (
        nomFlag != "" ||
        apeFlag != "" ||
        dniFlag != "" ||
        mailFlag != "" ||
        userFlag != "" ||
        contraFlag != ""
      ) {
        let msj = nomFlag + "<br>" +
          apeFlag + "<br>" +
          dniFlag + "<br>" +
          mailFlag + "<br>" +
          userFlag + "<br>" +
          contraFlag + "<br>";
  
        this.alert.error(msj);
      }else{
        this.crear_Cuenta();
        this.alert.mensajeDetallado("Creado correctamente","Le enviamos un mail");
      }

    },this.time);
  }

  private chequeoVacio(campo: any, extra: string) {
    let msj = "";
    let n = campo;
    if (n == "" || n == undefined || n.trim() == "") {
      msj += "El campo " + extra + " esta vacio";
    }
    return msj;
  }

  private chequeoStringNum(campo: string, extra: string) {
    let msj = this.chequeoVacio(campo, extra);
    let n = campo;
    if (msj == "") {
      let inaceptable = false;
      for (let i = 0; i < n.length && !inaceptable; i++) {
        if (this.is_numeric(n.charAt(i))) {
          inaceptable = true;
          msj += "El campo " + extra + " tiene numeros";
        }
      }
    }
    return msj;
  }

  private chequeoDni(campo: number) {
    let msj = "";
    if(campo == undefined){
      msj = "El campo dni esta vacio"
    }
    if(msj == ""){
      let dni = this.conexion.lista_Usuarios.find(
        (user) => user.dni == campo
      );
      if(dni != undefined){
        msj = "Ese dni ya esta agregado a la base de datos"
      }
    }
    return msj;
  }

  private chequeoUsuario(extra: string) {
    let campo = this.temp_usuario.nombre_usuario;
    let msj = this.chequeoVacio(campo, extra);

    if (msj == "") {
      if (campo.length < 4) {
        msj = "El campo " + extra + " es muy corto. 4 caracteres minimo"
      }else{
        let user = this.conexion.lista_Usuarios.find(
          (user) => user.nombre_usuario == campo
        );
        if(user != undefined){
          msj = "Ese nombre de usuario ya existe"
        }
      }
    }

    return msj;
  }

  private chequeoContra(extra: string) {
    let campo = this.temp_usuario.contrasenia;
    let msj = this.chequeoVacio(campo, extra);

    if (msj == "") {
      if (campo.length < 6 ||
        campo.toLowerCase() == campo ||
        campo.toUpperCase() == campo ||
        !this.tieneCharEsp(campo)
      ) {
        msj = "No cumple con los estandares de contraseñas: <br>" +
          "Una mayuscula, una minuscula, un caracter especial <br>" +
          "No menor de seis caracteres"
      } else {
        if (campo != this.contraCopia) {
          msj = "Las contraseñas no coinciden"
        }
      }
    }

    return msj;
  }

  private chequeoMail(extra: string) {
    let campo = this.temp_usuario.mail;
    let msj = this.chequeoVacio(campo, extra);

    if (msj == "") {
      if (!campo.includes("@")) {
        msj = "El campo mail es invalido."
      }else{
        let mail = this.conexion.lista_Usuarios.find(
          (user) => user.mail == campo
        );
        if(mail != undefined){
          msj = "Ese mail ya esta registrado"
        }
      }
    }
    return msj;
  }

  private is_numeric(str: string) {
    return /^\d+$/.test(str);
  }

  private tieneCharEsp(campo: string) {
    let encontrado = false;
    for (let i = 0; i < campo.length && !encontrado; i++) {
      if (
        // NUMEROS
        (campo.charCodeAt(i) < 48 || campo.charCodeAt(i) > 57) &&
        // LETRAS MAY
        (campo.charCodeAt(i) < 65 || campo.charCodeAt(i) > 90) &&
        // LETRAS MIN
        (campo.charCodeAt(i) < 97 || campo.charCodeAt(i) > 122)
      ) {
        encontrado = true;
      }
    }
    return encontrado;
  }

  private crear_Cuenta() {
    this.conexion.usuario.crearUsuario(this.temp_usuario).subscribe(async res => {
      console.log(res);
      this.conexion.refresh_BD();
    })

    this.limpiar();
  }

  private creacionMail() {
    let mail = new Mail();
    mail.to = this.temp_usuario.mail;
    mail.subject = "Creacion de usuario";
    mail.mailTemplate = `
    Bienvenido a RentCars, 
    su usuario es ` + this.temp_usuario.nombre_usuario
      + ", y su contraseña es " + this.temp_usuario.contrasenia;
    return mail;
  }

  private envioMail() {
    let mail = this.creacionMail();
    this.conexion.mail.enviarMail(mail)
      .subscribe((res: any) => {
        if (res != "") {
          this.mailError = true;
        }
      });
  }

  private limpiar() {
    this.temp_usuario = new Usuario();
    this.contraCopia = "";
    this.mailError = false;
    this.time = 0;
  }

}
