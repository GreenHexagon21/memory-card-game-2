import { StopperTime } from './../models/stopper-time';
import { Injectable, OnInit } from '@angular/core';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  private currentTime: StopperTime;
  private cards: Card[];


  constructor() {

  }

  public setGlobalTime(stopperTime:StopperTime) {
    this.currentTime = stopperTime;
  }

  public getGlobalTime() : StopperTime {
    return this.currentTime;
  }

  public setGlobalCards(cards : Card[]) {
    this.cards = cards;
  }

  public getGlobalCards() {
    return this.cards;
  }





}
