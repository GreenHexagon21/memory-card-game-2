import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }

  public e621UrlBuilder(tags: string[], order:string, rating:string) {
    let base = "https://e621.net/posts.json?tags="
  }
}
