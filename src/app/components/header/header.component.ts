import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ConexionService } from 'src/app/services/conexion.service';
import { LoginService } from 'src/app/services/login.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    public login: LoginService,
    private conexion: ConexionService,
    private router: Router,
    private alert: MessagesService
  ) { }

  @HostListener('window:beforeunload', ['$event'])
  handleClose(e: BeforeUnloadEvent): void {
    //console.log(this.login.usuario);
    //e.preventDefault();
    //e.returnValue = 'test';
    localStorage.clear();
    localStorage.setItem('User', JSON.stringify(this.login.usuario));
    localStorage.setItem('Duenio', JSON.stringify(this.login.duenio));
    localStorage.setItem('Sucursal', JSON.stringify(this.login.sucursal));
  }

  ngOnInit() {
    this.conexion.refresh_BD();
    this.login.setInicio();
  }

  public irA(donde: string) {

    if (!this.login.logeando) {
      this.router.navigate([donde]);
    } else {

      if (donde == 'Sign-Up') {
        this.sacar_Hidden(true);
      }
      this.router.navigate([donde]);
    }

  }

  public sacar_Hidden(bool: boolean) {
    let div = document.getElementById('ingresar') as HTMLElement;
    div.hidden = bool;
    div = document.getElementById('btn-ingresar') as HTMLElement;
    div.hidden = !bool;
    div = document.getElementById('mensaje-login') as HTMLElement;
    div.textContent = "Ingrese sus datos :";

    this.login.logeando = !bool;
  }

  public salir() {
    this.alert.pregunta("Estas seguro de querer desconectarte?","")
    .then(res =>{
      if(res.isConfirmed){
        this.login.desconectar();
        this.alert.mensajeInfo("Desconectando...");
        setTimeout(()=>{
          this.irA('');
        },500)
      }else{
        this.alert.cancelado();
      }
    })
  }
  
}
