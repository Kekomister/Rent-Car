import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Auto_Sucursal } from 'src/app/classes/auto_sucursal.model';

@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.css']
})
export class CartaComponent {

  @Input() array : any[] = [];
  @Input() cantidad : number = 99999999999;
  @Output() evtSelec : EventEmitter<any> = new EventEmitter<any>();

  constructor(){}

  ngOnInit(){
    // console.log("recibido");
    // console.log(this.array);
  }

  public seleccionado(seleccionado : Auto_Sucursal){
    this.evtSelec.emit(seleccionado);
  }
}
