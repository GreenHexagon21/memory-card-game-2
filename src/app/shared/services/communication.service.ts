import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Card } from './../../shared/models/card';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { CardStates } from '../models/enums/card-states';
import { CardRarities } from '../models/enums/card-rarities';
import { GlobalsService } from './globals.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  cardStates = CardStates;
  cardRarity = CardRarities;

  constructor(private http: HttpClient) { }

  getResponseFromUrl(url: string) {
    return firstValueFrom(this.http.get(url));
  }

  extractCardsFromJSON(jsonData,amount?:number) {
    let count = 0;
    let cards:Card[] = [];

    let minValue;
    let maxValue;
    let rangeDivision;

    if(jsonData != undefined) {
      let numberOfRarities = Object.keys(CardRarities).length;
      jsonData['posts'].forEach(post=> {
        count++;
        let currentValue
        if(!minValue) {
          minValue = Math.round(Math.sqrt((post['score']['total'])));
          maxValue = Math.round(Math.sqrt((post['score']['total'])));
        }
        if (count <= (amount? amount : 100)) {
          currentValue = Math.round(Math.sqrt((post['score']['total'])))
          if(currentValue > maxValue)
            maxValue = Math.round(Math.sqrt((post['score']['total'])))
          }
          if(currentValue < minValue)
            minValue = Math.round(Math.sqrt((post['score']['total'])))
          }
      );
      rangeDivision = (maxValue-minValue)/((Object.keys(CardRarities).length/2)-1);

      jsonData['posts'].forEach(post=> {
        console.log(post);
        count++;
        if (count <= (amount? amount : 100)) {
          let card : Card = {
            id: post['id'],
            imageUrl: post['file']['url'],
            state: CardStates.default,
            source: "https://e621.net/posts/"+post['id'],
            timesFlipped: -1,
            value: Math.round(Math.sqrt((post['score']['total']))),
            rarity:Math.floor((Math.round(Math.sqrt((post['score']['total'])))-minValue)/rangeDivision), //CardRarities[Object.keys(CardRarities)[Math.floor((Math.round(Math.sqrt((post['score']['total'])))-minValue)/rangeDivision)]]
            special: "",
            modified: ""
          }
          cards.push(card);
      }
      });
    }
    return cards;

  }

}
