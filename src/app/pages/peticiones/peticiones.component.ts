import { formatDate } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Auto_Sucursal } from 'src/app/classes/auto_sucursal.model';
import { Columna } from 'src/app/classes/columna.model';
import { Peticion } from 'src/app/classes/peticion.model';
import { Sucursal } from 'src/app/classes/sucursal.model';
import { ConexionService } from 'src/app/services/conexion.service';
import { LoginService } from 'src/app/services/login.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-peticiones',
  templateUrl: './peticiones.component.html',
  styleUrls: ['./peticiones.component.css']
})
export class PeticionesComponent {

  titulos: Columna[] = [
    { field: "id_peticion", header: "ID" },
    { field: "ciudad_ret", header: "Ciudad de retiro" },
    { field: "ciudad_dev", header: "Ciudad de devolucion" },
    { field: "fecha_retiro", header: "Fecha de retiro"},
    { field: "fecha_devolucion", header: "Fecha de devolucion"},
    { field: "", header: "Informacion del auto" },
    { field: "precio", header: "Precio" },
    { field: "codigo_retiro", header: "Codigo de retiro" },
    { field: "finalizado", header: "Finalizado" }
  ];

  peticiones: Peticion[] = [];
  sucursales: Sucursal[] = [];

  auto : Auto_Sucursal = new Auto_Sucursal();

  modificarFlag: boolean = false;
  expandirFlag: boolean = false;
  temp_sucursal: number = -1;
  temp_pet: number = -1;

  constructor(
    private login: LoginService,
    private router: Router,
    private conexion: ConexionService,
    private alert: MessagesService,
    private renderer: Renderer2
  ) { 
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        window.location.pathname == "/Peticiones" &&
        e.target == document.getElementsByClassName("cuerpo").item(0)
      ) {
        this.expandirFlag = false;
      }
    });
  }

  ngOnInit() {
    if (this.login.usuario.id_usuario == undefined) {
      this.router.navigate(['']);
    } else {
      this.llenarMisArrays();
    }
  }

  public accion(event: any) {
    //console.log(event);
    let pet: Peticion = event[1];
    switch (event[0]) {
      case "borrar":
        let infoPet = "Datos de la peticion" +
          "<br> ID de la peticion: " + pet.id_peticion +
          "<br> Ciudad de retiro: " + pet.ciudad_ret +
          "<br> Ciudad de devolucion: " + pet.ciudad_dev +
          "<br> Fecha de retiro: " + this.formatoFecha(pet.fecha_retiro) +
          "<br> Fecha de devolucion: " + this.formatoFecha(pet.fecha_devolucion) +
          "<br> Precio: " + pet.precio;
        this.alert.pregunta("Seguro de cancelar la peticion?", infoPet)
          .then(res => {
            if (res.isConfirmed) {
              this.conexion.peticion
                .borrarPeticion(pet.id_peticion)
                .subscribe((res: any) => {
                  //console.log(res);
                  this.alert.mensajeBien("Se ha borrado correctamente!")
                  this.llenarMisArrays();
                });
            } else {
              this.alert.cancelado();
            }
          })
        break;
      case "modificar":
        this.temp_pet = event[1].id_peticion;
        this.modificarFlag = true;
        break;
      case "expandir":
        let a = this.conexion.lista_Auto_Suc.find(auto => auto.id_auto_sucursal == pet.auto_sucursal);
        if(a != undefined){
          this.auto = a;
        }
        this.expandirFlag = true;
        break;
      default:
        break;
    }
  }

  public cambiarPeticion() {
    if (this.temp_sucursal == -1) {
      this.alert.error("Tiene que elegir una ciudad nueva de devolucion");
    } else {
      let scsalAc = this.peticiones.find(suc => suc.id_peticion == this.temp_pet);
      let scsalNv = this.sucursales.find(suc => suc.id_sucursal == this.temp_sucursal);
      let datosCiud =
        "Ciudad de devolucion actual: " + scsalAc?.ciudad_dev +
        "<br> Ciudad de devolucion nueva: " + scsalNv?.ciudad;
      this.alert.pregunta("Seguro de cambiar de ciudad de devolucion?", datosCiud)
        .then(res => {
          if (res.isConfirmed) {
            this.conexion.peticion
              .modificarPeticion(this.temp_pet, this.temp_sucursal)
              .subscribe((res: any) => {
                //console.log(res);
                this.alert.mensajeBien("Cambiado correctamente!");
                this.llenarMisArrays();
              });
          } else {
            this.alert.cancelado();
          }
        })
    }
  }

  private llenarMisArrays() {
    this.limpiar();
    this.conexion.refresh_BD();
    new Promise(resolve => {
      setTimeout(() => {
        //resolve("\t\t This is first promise");
        this.peticiones = this.llenarPet(this.conexion.lista_Peticiones);
        this.sucursales = this.conexion.lista_Sucursales;
        //console.log("Peticiones : ");
        //console.log(this.peticiones);
        this.conexion.conectado = true;
      }, 1000);
    });
  }

  private llenarPet(array: Peticion[]) {
    let dentro: Peticion[] = [];
    array.forEach(pet => {
      if (pet.usuario == this.login.usuario.id_usuario) {
        dentro.push(pet);
      }
    });
    return dentro;
  }

  private limpiar() {
    this.conexion.conectado = false;
    this.modificarFlag = false;
    this.expandirFlag = false;
    this.temp_sucursal = -1;
    this.temp_pet = -1;
    this.auto = new Auto_Sucursal();
  }

  private formatoFecha(fecha: Date | string) {
    return formatDate(fecha, 'yyyy-MM-dd', 'en-us');
  }

}
