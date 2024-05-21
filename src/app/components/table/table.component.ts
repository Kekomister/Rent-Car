import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Columna } from 'src/app/classes/columna.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  @Input() filas: any[] = [];
  
  @Input() columnas: Columna[] | undefined;

  @Output() accion: EventEmitter<any[]> = new EventEmitter<any[]>();

  borrar(info: any) {
    this.accion.emit(["borrar", info]);
  }

  modificar(info: any) {
    this.accion.emit(["modificar", info]);
  }

  expandir(info: any){
    this.accion.emit(["expandir", info]);
  }

}
