import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }
}
