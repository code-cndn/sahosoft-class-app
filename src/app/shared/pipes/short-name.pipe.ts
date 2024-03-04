import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortName',
  standalone: true
})
export class ShortNamePipe implements PipeTransform {


  transform(value: string, ...args: unknown[]): unknown {

    var str = value.split(' ').slice(0, 2).join(' ');
    let acronym = str.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');

    return acronym;
  }

}



