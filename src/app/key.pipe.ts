import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeyPipe implements PipeTransform {

  transform(json: any, priorities: any): any {
    if (!json) {
      return json;
    }

    const keys = [];
    let priority = 99;
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        for (const prio in priorities) {
          if (priorities.hasOwnProperty(prio)) {
            if (key.toLowerCase().includes(prio)) {
              priority = priorities[prio];
            }
          }
        }
        keys.push({order: priority, key: key, value: json[key], id: key.toLowerCase().split(' ').join('-')});
      }
    }
    return keys.sort((a, b) => a.order - b.order);
  }

}
