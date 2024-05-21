import { Pipe, PipeTransform } from '@angular/core';
import { Auto_Sucursal } from '../classes/auto_sucursal.model';

@Pipe({
  name: 'noRentados'
})
export class NoRentadosPipe implements PipeTransform {

  transform(value: Auto_Sucursal[], ...args: unknown[]): Auto_Sucursal[] {
    let array : Auto_Sucursal[] = [];
    value.forEach(v => {
      if(!v.reservado){
        array.push(v);
      }
    })
    return array;
  }

}
