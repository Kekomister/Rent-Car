import { Pipe, PipeTransform } from '@angular/core';
import { Auto_Sucursal } from '../classes/auto_sucursal.model';

@Pipe({
  name: 'resetAutos'
})
export class ResetAutosPipe implements PipeTransform {

  transform(value: Auto_Sucursal[], ...args: unknown[]): Auto_Sucursal[] {
    value.forEach(auto => {
      auto.cantidad = undefined;
    });
    return value;
  }

}
