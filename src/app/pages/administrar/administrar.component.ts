import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Auto } from 'src/app/classes/auto.model';
import { Auto_Sucursal } from 'src/app/classes/auto_sucursal.model';
import { Sucursal } from 'src/app/classes/sucursal.model';
import { ConexionService } from 'src/app/services/conexion.service';
import { LoginService } from 'src/app/services/login.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.component.html',
  styleUrls: ['./administrar.component.css']
})
export class AdministrarComponent {

  @ViewChild("fileUpload", { static: false })
  fileUpload!: ElementRef;
  files: any = [];

  autos_suc: Auto_Sucursal[] = [];
  autosGlobal: Auto[] = [];
  ciudades: Sucursal[] = [];

  agregarFlag: boolean = false;
  creadoFlag: boolean = false;
  mostrarImagen: boolean = false;
  moverFlag: boolean = false;

  temp_Auto: Auto = new Auto();
  temp_Auto_Suc: Auto_Sucursal = new Auto_Sucursal();
  temp_Suc: Sucursal = new Sucursal;

  muestraImagen: string = '';
  mensaje: string = "Crear Auto";

  constructor(
    private login: LoginService,
    private conexion: ConexionService,
    private router: Router,
    private renderer: Renderer2,
    private alert: MessagesService
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        window.location.pathname == "/Administrar" &&
        e.target != document.getElementById('vision-autos') &&
        e.target != document.getElementById('btn-vision')
      ) {
        this.sacar_Hidden(true);
      }
    });
  }

  ngOnInit() {
    if (this.login.duenio != -1) {
      this.llenarArrays();
    } else {
      this.router.navigate([""]);
    }
  }

  public agregar() {
    this.agregarFlag = true;
    this.creadoFlag = false;
    this.moverFlag = false;
    this.seteoNomMarcaInput(false);
  }

  public mover() {
    this.agregarFlag = false;
    this.creadoFlag = false;
    this.moverFlag = true;
  }

  public tocadoAfuera(event: any) {
    this.seteoTocado(event);

    let elem = document.getElementById("vision-autos") as HTMLElement;
    elem.hidden = true;

    this.mensaje = "Agregar auto existente en otra sucursal"
    this.muestraImagen = this.temp_Auto.imagen;
  }

  public tocadoAdentro(event: any) {
    this.seteoTocado(event);

    this.mensaje = "Agregar copia"
    this.muestraImagen = this.temp_Auto.imagen;
  }

  public subir() {
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = async () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0 });
      }
      //this.pub.imagen = this.files[0].data;
      this.temp_Auto.imagen = this.files[this.files.length - 1].data;

      this.despuesClick();
    };
    fileUpload.click();
  }

  public despuesClick() {
    this.fileUpload.nativeElement.value = '';
    //console.log(this.files[0].data);

    this.sendFile(this.files[0]);
  }

  public async sendFile(file: any) {

    const formData = new FormData();
    formData.append('file', file.data);
    file.inProgress = true;

    this.conexion.auto.devolverImagen(formData)
      .subscribe(async (event: any) => {
        //console.log(event.body);
        if (event.body != undefined) {
          this.mostrarImagen = true;
          this.muestraImagen = await event.body[0].imagen;
          //console.log(this.muestraImagen);
        }
      });
  }

  public crearTipoAuto() {
    let msjPregunta = 
      "Datos del auto <br> Nombre del auto: " + this.temp_Auto.nombre +
      "<br> Marca del auto: " + this.temp_Auto.marca + 
      "<br> Costo del auto: " + this.temp_Auto.costo;
    if (this.temp_Auto.id_auto != undefined) {
      let msg = this.chequeoVaciosAgreg(false);
      if (msg == "") {

        this.alert.pregunta("Esta seguro?", msjPregunta)
          .then((res) => {
            if (res.isConfirmed) {

              // TODO ESTO MODIFICA EL AUTO A LOS ESTANDARES NUEVOS
              // (COSTO Y/O IMAGEN) PARA DESPUES AGREGARLO 
              // A NUESTRA SUCURSAL
              const formData = new FormData();
              if (this.files.length > 0) {
                formData.append('file', this.temp_Auto.imagen);
              }
              formData.append('costo', String(this.temp_Auto.costo));
              this.conexion.auto.modificarAuto(
                this.temp_Auto.id_auto, formData
              ).subscribe((res: any) => {
                // PARA QUE NO SE HAGA 3000 MIL VECES
                if (this.creadoFlag == false) {
                  //console.log("AUTO UPDATE");
                  this.crearAutoViejo();
                  this.alert.mensajeBien("Se agrego correctamente");
                }
              })

            }else{
              this.alert.cancelado();
            }
          });

      } else {
        this.alert.error(msg);
      }
    } else {
      let msg = this.chequeoVaciosAgreg(true);
      if (msg == "") {
        this.alert
          .pregunta("Esta seguro?", msjPregunta)
          .then((res) => {
            if (res.isConfirmed) {
              this.crearAutoNuevo();
              this.alert.mensajeBien("Se agrego correctamente");
            } else {
              this.alert.cancelado();
            }
          })
      } else {
        this.alert.error(msg);
      }
    }
  }

  public crearAutoNuevo() {
    const formData = new FormData();
    formData.append('file', this.temp_Auto.imagen);
    formData.append('nombre', this.temp_Auto.nombre);
    formData.append('marca', this.temp_Auto.marca);
    formData.append('costo', String(this.temp_Auto.costo));
    //this.files[0].inProgress = true;
    let una_vez = false;
    this.conexion.auto.crearAuto(formData).subscribe((res: any) => {
      //console.log(res.ok);
      if (res.ok != undefined && !una_vez) {
        this.crearAutoEnSucursal();
        una_vez = true;
      }
    });
  }

  public crearAutoViejo() {
    //console.log(this.temp_Auto);

    let nuevo = new Auto_Sucursal();
    nuevo.id_auto = this.temp_Auto.id_auto;
    nuevo.id_sucursal_actual = this.login.duenio;
    this.conexion.auto_suc.crearOldAuto_Sucursal(nuevo)
      .subscribe((res: any) => {
        this.agregarFlag = false;
        this.llenarArrays();
        this.creadoFlag = true;
      })
  }

  public limpiar() {
    this.files = [];

    this.muestraImagen = "";
    this.mensaje = "Crear Auto";
    this.temp_Auto = new Auto();
    this.temp_Auto_Suc = new Auto_Sucursal();
    this.temp_Suc = new Sucursal();

    this.agregarFlag = false;
    this.mostrarImagen = false;
    this.moverFlag = false;
    this.creadoFlag = false;
  }

  public sacar_Hidden(bool: boolean) {
    let elem = document.getElementById("vision-autos") as HTMLElement;
    elem.hidden = bool;
  }

  public seleccionadoMover(event: any) {
    this.temp_Auto_Suc = event;
  }

  public modificarAutoSuc() {
    //console.log(this.temp_Auto_Suc.id_auto_sucursal);
    //console.log(this.temp_Suc.id_sucursal);
    let mensajes = this.crearMsjsModificar();
    let msg = "";
    if (this.temp_Auto_Suc.id_auto_sucursal == undefined) {
      msg = "Seleccione un auto por favor.";
    }else{
      if(this.temp_Suc.id_sucursal == undefined){
        msg = "Seleccione la sucursal a la que quiere moverlo.";
      }
    }

    if (msg == "") {

      if (this.temp_Suc.id_sucursal == -1) {
        this.alert.pregunta("Seguro de querer borrar el auto?", mensajes[0])
        .then(res => {
          if(res.isConfirmed){
            this.conexion.auto_suc
            .eliminarAuto_Sucursal(this.temp_Auto_Suc.id_auto_sucursal)
            .subscribe(res => {
              this.alert.borrado();
              this.llenarArrays();
            })
          }else{
            this.alert.cancelado();
          }
        })
      } else {
        this.alert.pregunta("Seguro de querer moverlo?", mensajes[1])
        .then(res => {
          if(res.isConfirmed){
            this.conexion.auto_suc
            .modificarAuto_Sucursal(this.temp_Auto_Suc.id_auto_sucursal, this.temp_Suc.id_sucursal)
            .subscribe(res => {
              this.alert.mensajeBien("Movido correctamente!");
              this.llenarArrays();
            })
          }else{
            this.alert.cancelado();
          }
        })
      }

    } else {
      this.alert.error(msg);
    }

  }

  private chequeoVaciosAgreg(chequeoImagen: boolean) {
    let msg = "";
    let nomFlag = this.vacio(this.temp_Auto.nombre, " nombre");
    let marcaFlag = this.vacio(this.temp_Auto.marca, "a marca");
    let costoFlag = this.vacio(String(this.temp_Auto.costo), " costo");
    let imgFlag = "";
    if (chequeoImagen) {
      if (this.files.length < 1) {
        imgFlag = "No hay una imagen agregada"
      }
    }

    if (
      nomFlag != "" ||
      marcaFlag != "" ||
      costoFlag != "" ||
      imgFlag != ""
    ) {
      msg = nomFlag + "<br>" +
        marcaFlag + "<br>" +
        costoFlag + "<br>" +
        imgFlag + "<br>";
    }
    return msg;
  }

  private vacio(campo: string, extra: string) {
    let msj = "";
    if (
      campo == "" ||
      campo == undefined ||
      campo.trim() == "" ||
      campo == "undefined" ||
      campo == "null"
    ) {
      msj = "Necesita ingresar un" + extra;
    }
    return msj;
  }

  private seteoTocado(event: any) {
    this.temp_Auto = event;
    this.agregarFlag = true;
    this.mostrarImagen = true;
    this.creadoFlag = false;
    this.moverFlag = false;

    this.seteoNomMarcaInput(true);
  }

  private crearAutoEnSucursal() {
    let nuevo = new Auto_Sucursal();
    nuevo.id_sucursal_actual = this.login.duenio;
    this.conexion.auto_suc.crearNewAuto_Sucursal(nuevo).subscribe((res: any) => {
      this.agregarFlag = false;
      this.llenarArrays();
    })
  }

  private llenarArrays() {
    this.conexion.conectado = false;
    this.limpiar();
    this.conexion.refresh_BD();
    setTimeout(() => {
      this.autosGlobal = this.conexion.lista_Autos;
      this.autosEnSucursal(this.conexion.lista_Auto_Suc);
      this.ciudades = this.sucDistintas(this.conexion.lista_Sucursales);

      this.conexion.conectado = true;
    }, 1000);
  }

  private autosEnSucursal(array: Auto_Sucursal[]) {
    this.autos_suc = [];
    array.forEach(auto => {
      if (auto.id_sucursal_actual == this.login.duenio) {
        this.autos_suc.push(auto);
      }
    });
  }

  private sucDistintas(array: Sucursal[]): Sucursal[] {
    let ciud: Sucursal[] = [];
    array.forEach(suc => {
      if (suc.id_sucursal != this.login.duenio) {
        ciud.push(suc);
      }
    })
    return ciud;
  }

  private seteoNomMarcaInput(bool: boolean) {
    setTimeout(() => {
      let inp = document.getElementById("admin-nombre") as HTMLInputElement;
      inp.readOnly = bool;
      inp = document.getElementById("admin-marca") as HTMLInputElement;
      inp.readOnly = bool;
    }, 500)
  }

  private crearMsjsModificar() : string[]{
    let datosAuto = 
    "Datos del auto" + "<br> ID del auto: " + this.temp_Auto_Suc.id_auto_sucursal + 
    "<br> Nombre del auto: " + this.temp_Auto_Suc.nombre +
    "<br> Marca del auto: " + this.temp_Auto_Suc.marca + 
    "<br> Costo del auto: " + this.temp_Auto_Suc.costo;

    let tempNom = this.conexion.lista_Sucursales.find((city) => city.id_sucursal == this.temp_Auto_Suc.id_sucursal_actual);
    let deDondeADonde = 
      `Sucursal actual: ` + tempNom?.ciudad +
      `<br> Sucursal destino: ` + this.temp_Suc.ciudad;

    return [datosAuto,deDondeADonde];
  }

}
