import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Peticion } from 'src/app/classes/peticion.model';
import { Sucursal } from 'src/app/classes/sucursal.model';
import { ConexionService } from 'src/app/services/conexion.service';

import { formatDate } from '@angular/common';
import { Auto_Sucursal } from 'src/app/classes/auto_sucursal.model';
import { LoginService } from 'src/app/services/login.service';
import { MessagesService } from 'src/app/services/messages.service';
import { NoRentadosPipe } from 'src/app/pipes/no-rentados.pipe';
import { Auto } from 'src/app/classes/auto.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  verFlag: boolean = false;
  filtrarFlag: boolean = false;

  autosMuestra: Auto[] = [];
  autosFiltrados: Auto_Sucursal[] = [];

  ciudades: Sucursal[] = [];
  autos: Auto_Sucursal[] = [];
  marcas: String[] = [];

  minDate: Date = new Date();
  maxDate: Date = new Date();

  temp_peticion: Peticion = new Peticion();

  constructor(
    private conexion: ConexionService,
    private router: Router,
    public login: LoginService,
    private noRentado: NoRentadosPipe,
    private alert: MessagesService,
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        window.location.href == "http://localhost:4200/" &&
        e.target == document.getElementById("btn_home")
      ) {
        this.limpiar();
      }
    });
  }

  ngOnInit() {
    this.conexion.refresh_BD();
    this.conexion.conectado = false;
    setTimeout(() => {
      this.ciudades = this.conexion.lista_Sucursales;
      this.autosMuestra = this.conexion.lista_Autos;
      this.marcas = this.conexion.lista_Marcas;
      this.conexion.conectado = true;
    }, this.conexion.timeout);

    this.seteoDia();
  }

  public irA(donde: string) {
    this.router.navigate([donde]);
  }

  public chequeoCampos() {
    if (!this.login.logeando) {

      let msj = this.chequeoVacio(this.temp_peticion.sucursal_retiro, "ciudad de retiro");
      msj += this.chequeoVacio(this.temp_peticion.sucursal_devolucion, "ciudad de devolucion");
      msj += this.chequeoVacio(this.temp_peticion.fecha_retiro, "fecha de retiro");
      msj += this.chequeoVacio(this.temp_peticion.fecha_devolucion, "fecha de devolucion");

      if (msj != "") {
        this.alert.error(msj);
      } else {
        if (this.fechasIncoherentes()) {
          this.alert.error("La fecha de devolucion debe ser el mismo dia o despues de la fecha de retiro")
        } else {
          this.buscar();
        }
      }

    }
  }

  public tocado(event: any) {
    if (this.login.chequeoCliente()) {
      this.irA(
        "Rentar/" +
        event.id_auto_sucursal + "/" +
        [
          this.temp_peticion.fecha_retiro,
          this.temp_peticion.fecha_devolucion,
          this.temp_peticion.sucursal_retiro,
          this.temp_peticion.sucursal_devolucion
        ]
      );
    } else {
      let element = document.getElementById('btn-ingresar') as HTMLElement;
      element.click();
      element = document.getElementById('mensaje-login') as HTMLElement;
      element.textContent = "Primero ingrese a su cuenta";
    }
  }

  public verTodos() {
    this.verFlag = true;
  }

  public volver() {
    this.limpiar();
  }

  public filtroMarca(marca: String) {
    this.filtrarFlag = true;
    this.autosFiltrados = [];
    this.autos.forEach(ato => {
      if (ato.marca == marca) {
        this.autosFiltrados.push(ato);
      }
    });
  }

  private chequeoVacio(campo: any, extra: string) {
    let msj = "";
    if (campo == "" || campo == undefined) {
      msj += "El campo " + extra + " esta vacio<br>";
    } else {
      campo = String(campo);
      if (campo.trim() == "") {
        msj += "El campo " + extra + " esta vacio<br>";
      }
    }
    return msj;
  }

  private fechasIncoherentes() {
    let f_ret = this.traerPorcionFecha(this.formatoFecha(this.temp_peticion.fecha_retiro));
    let f_dev = this.traerPorcionFecha(this.formatoFecha(this.temp_peticion.fecha_devolucion));

    //console.log(f_ret);
    //console.log(f_dev);

    let incoh = false;
    if (f_ret.mes > f_dev.mes) {
      if (f_ret.anio == f_dev.anio) {
        incoh = true;
      } else {
        if (f_ret.anio > f_dev.anio) {
          incoh = true;
        }
      }
    } else {
      if (f_ret.mes == f_dev.mes) {
        if (f_ret.dia > f_dev.dia) {
          incoh = true;
        }
      }
    }
    return incoh;
  }

  private buscar() {
    this.temp_peticion.fecha_retiro = this.formatoFecha(this.temp_peticion.fecha_retiro);
    this.temp_peticion.fecha_devolucion = this.formatoFecha(this.temp_peticion.fecha_devolucion);
    this.buscarAutos();
  }

  private buscarAutos() {
    let array: Auto_Sucursal[] = [];
    this.conexion.lista_Auto_Suc.forEach(auto => {
      if (auto.id_sucursal_actual == this.temp_peticion.sucursal_retiro) {
        array.push(auto);
      }
    });
    // console.log("Autos dentro de la ciudad deseada: ");
    // console.log(array);
    this.yaRentados(array);
  }

  private yaRentados(array: Auto_Sucursal[]) {
    let petics = this.traerPetEnRango();
    array.forEach(aut => {
      let rent = petics.find(p => p.auto_sucursal == aut.id_auto_sucursal);
      if (rent != undefined) {
        aut.reservado = true;
      } else {
        aut.reservado = false;
      }
    })
    if (this.noRentado.transform(array).length == 0) {
      this.alert.error("No se encontro ningun vehiculo disponible para esas fechas")
    } else {
      this.autos = array;
      this.buscarMarcas();
    }
  }

  private buscarMarcas() {
    let array: String[] = [];

    this.marcas.forEach(mca => {
      let esta = false;
      for (let i = 0; i < this.autos.length && !esta; i++) {
        if (this.autos[i].marca == mca) {
          array.push(mca);
          esta = true;
        }
      }
    });
    this.marcas = array;
  }

  private formatoFecha(fecha: Date | string) {
    return formatDate(fecha, 'yyyy-MM-dd', 'en-us');
  }

  private seteoDia() {
    let month = this.minDate.getMonth();
    let year = this.minDate.getFullYear();
    // SETEA UN MES ADELANTE
    let nextMonth = (month === 11) ? 0 : month + 1;
    // SETEA OTRO MES ADELANTE
    nextMonth = (nextMonth === 11) ? 0 : nextMonth + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;
    this.maxDate.setMonth(nextMonth);
    this.maxDate.setFullYear(nextYear);
  }

  private traerPetEnRango(): Peticion[] {
    let ps: Peticion[] = [];
    this.conexion.lista_Peticiones.forEach(pet => {
      if (!pet.finalizado) {
        let f_dev = this.formatoFecha(pet.fecha_devolucion);
        let f_ret = this.formatoFecha(pet.fecha_retiro);
        if (
          this.fechaAdentro(f_dev, f_ret)
        ) {
          ps.push(pet);
        }
      }
    })
    return ps;
  }

  private fechaAdentro(f_dev: string, f_ret: string): boolean {
    // ESTOS SON LOS DE LA PETICION OCURRENTE
    let oc_ret = this.traerPorcionFecha(this.temp_peticion.fecha_retiro);
    //console.log(oc_ret.dia + "/" + oc_ret.mes + "/" + oc_ret.anio);

    let oc_dev = this.traerPorcionFecha(this.temp_peticion.fecha_devolucion);
    //console.log(oc_dev.dia + "/" + oc_dev.mes + "/" + oc_dev.anio);

    // ESTOS SON LOS DEL ARRAY DE PETICIONES
    let ret = {
      dia: Number(f_ret.slice(8, 10)),
      mes: Number(f_ret.slice(5, 7)),
      anio: Number(f_ret.slice(0, 4))
    };
    //console.log(ret.dia + "/" + ret.mes + "/" + ret.anio);

    let dev = {
      dia: Number(f_dev.slice(8, 10)),
      mes: Number(f_dev.slice(5, 7)),
      anio: Number(f_dev.slice(0, 4))
    };
    //console.log(dev.dia + "/" + dev.mes + "/" + dev.anio);

    let adentro = false;

    // SI LO DEVUELVO EN EL MISMO ANIO
    if (dev.anio == oc_ret.anio) {
      // SI LO DEVUELVO EN EL MISMO MES
      if (dev.mes == oc_ret.mes) {
        // SI LO DEVUELVO DESPUES DE CUANDO LO QUERES RENTAR
        if (dev.dia >= oc_ret.dia) {
          adentro = true;
        }
      } else {
        // SI LO DEVUELVO EN MESES ADELANTES DEL QUERIDO
        // EJEMPLO : DEVUELVO EN MES 3 Y LO PEDIS EN MES 2
        if (dev.mes > oc_ret.mes) {
          // SI LO PEDI ANTES DE TU DEVOLUCION
          // EJEMPLO : LO PEDI EN MES 3 Y VOS LO DEVOLVES EN MES 4
          if (ret.mes < oc_dev.mes) {
            adentro = true;
          } else {
            // SI LO PEDI EL MISMO MES QUE TU DEVOLUCION
            if (ret.mes == oc_dev.mes) {
              // SI LO PEDI DIA/S ANTES DE TU DEVOLUCION
              if (ret.dia <= oc_dev.dia) {
                adentro = true;
              }
            }
          }
        }
      }
    }

    return adentro;
  }

  private traerPorcionFecha(f: string | Date) {
    return {
      dia: Number(String(f).slice(8, 10)),
      mes: Number(String(f).slice(5, 7)),
      anio: Number(String(f).slice(0, 4))
    };
  }

  private limpiar() {
    this.temp_peticion = new Peticion();
    this.autos = [];
    this.autosFiltrados = [];
    this.verFlag = false;
    this.filtrarFlag = false;
  }

}
