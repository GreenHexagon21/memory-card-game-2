import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Card } from './../../shared/models/card';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor(private http: HttpClient) { }

  getResponseFromUrl(url: string) {
    return firstValueFrom(this.http.get(url));
  }

  extractCardsFromJSON(jsonData) {
    let cards:Card[] = [];
    if(jsonData != undefined) {
      jsonData['posts'].forEach(post=> {
        let card : Card = {
          id: post['id'],
          imageUrl: post['file']['url'],
          state: 'default'
        }
        cards.push(card);
      });
    }
    return cards;

  }

  doubleArray(array: any[]) {
    let newArray : any[] = [];
    array.forEach( e => {
      newArray.push({...e});
      newArray.push({...e});
    } )
    return newArray;
  }

  shuffleArray(anArray: any[]): any[] {
    return anArray.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

}