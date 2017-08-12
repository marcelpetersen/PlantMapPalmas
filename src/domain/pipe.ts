import { Pipe } from '@angular/core';
import { Arvore } from '../model/arvore';

@Pipe({
  name: "sortPipeDistancia"
})
export class SortPipeDistancia {

  transform(lista: Array<Arvore>): Array<Arvore> {
    if(lista != null){
      lista.sort((a: Arvore, b: Arvore) => {
        if (a.distancia < b.distancia) {
          return -1;
        } else if (a.distancia > b.distancia) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return lista;
  }

}
