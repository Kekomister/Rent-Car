import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolean'
})
export class BooleanPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let msj = "NI IDEA"
    if(value == 1){
      msj = "SI";
    }else{
      if(value == 0){
        msj = "NO";
      }
    }
    
    return msj;
  }

}
