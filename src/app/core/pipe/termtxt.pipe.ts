import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'termtxt',
  standalone: true
})
export class TermtxtPipe implements PipeTransform {

  transform(text: string, limit: number): string {
    return text.split(" ",limit).join(" ");
  }

}
