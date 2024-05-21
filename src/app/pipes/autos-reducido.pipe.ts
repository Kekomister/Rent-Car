import { Pipe, PipeTransform } from '@angular/core';
import { Auto_Sucursal } from '../classes/auto_sucursal.model';

@Pipe({
  name: 'autosReducido'
})
export class AutosReducidoPipe implements PipeTransform {

  transform(value: Auto_Sucursal[], ...args: unknown[]): Auto_Sucursal[] {
    //console.log(value);
    let convertido : Auto_Sucursal[] = [];
    for(let i = 0; i < value.length; i++){
      let yaEsta = false;
      for(let j = 0; j < convertido.length && !yaEsta; j++){
        if(value[i].id_auto == convertido[j].id_auto){
          yaEsta = true;
          convertido[j].cantidad! += 1;
        }
      }
      if(!yaEsta){
        convertido.push(value[i]);
        convertido[convertido.length -1].cantidad = 1;
      }
    }
    return convertido;
  }

}
