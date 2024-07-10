import { Pipe, PipeTransform } from '@angular/core';
import { Auto } from '../classes/auto.model';

@Pipe({
  name: 'random'
})
export class RandomPipe implements PipeTransform {

  transform(value: Auto[], ...args: unknown[]): Auto[] {
    let autos: Auto[] = [];
    let tocados: number[] = [];
    let rango = 4;
    if(value.length < 4){
      rango = value.length;
    }
    for (let i = 0; i < rango;) {
      let fallado  = false;
      let r = Math.floor(Math.random() * value.length);
      for (let j = 0; j < tocados.length; j++) {
        if (r == tocados[j]) {
          fallado = true;
        }
      }
      if(!fallado){
        autos.push(value[r]);
        tocados.push(r);
        i++;
      }
    }
    return autos;
  }

}
