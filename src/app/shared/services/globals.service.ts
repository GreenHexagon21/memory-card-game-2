import { Settings } from './../models/settings';
import { StopperTime } from './../models/stopper-time';
import { Injectable, OnInit } from '@angular/core';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  private currentTime: StopperTime;
  private cards: Card[];
  private _score: number = 0;
  private _settings: Settings;

  constructor() {

  }

  public get settings(): Settings {
    return this._settings;
  }
  public set settings(value: Settings) {
    this._settings = value;
  }

  public get score(): number {
    return this._score;
  }
  public set score(value: number) {
    this._score = value;
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
