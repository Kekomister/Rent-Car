import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auto_Sucursal } from 'src/app/classes/auto_sucursal.model';
import { Peticion } from 'src/app/classes/peticion.model';
import { ConexionService } from 'src/app/services/conexion.service';
import { LoginService } from 'src/app/services/login.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-rentar',
  templateUrl: './rentar.component.html',
  styleUrls: ['./rentar.component.css']
})
export class RentarComponent {

  auto_selec : Auto_Sucursal[] = [];
  temp_peticion : Peticion = new Peticion();

  recibo : boolean = false;

  constructor(
    private route: ActivatedRoute,
    private conexion : ConexionService,
    public login : LoginService,
    private router : Router
  ){}

  ngOnInit(){
    if(this.login.usuario.id_usuario != undefined){
      this.conexion.conectado = false;
      let id_buscar = -1;
      this.route.paramMap.subscribe((params) => {
        id_buscar = Number(params.get('id'));

        let peticion = params.getAll('peticion');
        this.separarPeticion(peticion);

        console.log("Peticion : ");
        console.log(this.temp_peticion);
        
        this.conexion.auto_suc.buscarAuto_Sucursal(id_buscar).subscribe(async (res : any) => {
          this.auto_selec = await res;
          console.log("Auto elegido : ");
          console.log(this.auto_selec);
        });
        this.conexion.conectado = true;
      })
    }else{
      this.irA('');
    }
  }

  public subirPeticion(){
    this.llenadoPeticion();
    this.conexion.peticion.
    crearPeticion(this.temp_peticion).
    subscribe(() => {
      this.conexion.refresh_BD();
      this.recibo = true;
    })
  }

  public buscarSucursal(sucursal : number){
    let array_S = this.conexion.lista_Sucursales;

    let city = "Not found";
    for (let i = 0; i < array_S.length && city == "Not found"; i++) {
      if(array_S[i].id_sucursal == sucursal){
        city = array_S[i].ciudad;
      }
    }
    return city;
  }

  public irA(donde : string){
    this.router.navigate([donde]);
  }

  private llenadoPeticion(){
    let codigo = "";
    for(let i = 0; i < 5; i++){
      let r;
      do{
        r = Math.floor(Math.random() * 100);
      }while(
        // ESTO AGARRA SOLO NUMEROS Y LETRAS, NO SIMBOLOS
        r < 48 || 
        (r > 57 && r < 65) || 
        (r > 90 && r < 97) ||
        r > 122
      );
      codigo += String.fromCharCode(r)
    }
    this.temp_peticion.codigo_retiro = codigo;
    this.temp_peticion.precio = this.auto_selec[0].costo;
    this.temp_peticion.auto_sucursal = this.auto_selec[0].id_auto_sucursal;
    this.temp_peticion.usuario = this.login.usuario.id_usuario;
    this.temp_peticion.finalizado = false;
    //console.log(this.temp_peticion);
  }

  private separarPeticion(array : string[]){
    let text = "";
    let pet_array = [];
    for(let i = 0; i < array[0].length; i++){
      if(array[0][i] == ','){
        pet_array.push(text);
        text = "";
      }else{
        text += array[0][i];
      }
    }
    pet_array.push(text);

    //console.log(pet_array);

    this.temp_peticion.fecha_retiro = pet_array[0];
    this.temp_peticion.fecha_devolucion = pet_array[1];
    this.temp_peticion.sucursal_retiro = Number(pet_array[2]);
    this.temp_peticion.sucursal_devolucion = Number(pet_array[3]);
    
  }

}
