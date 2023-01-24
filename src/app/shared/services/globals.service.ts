import { Score } from './../models/score';
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
  private _currencyScore: number;
  private _score: number = 0;
  private _settings: Settings;
  private _scores: Score[] = [];


  constructor() {

    this._settings = {
      matchCountNeeded: 2,
      imageHeight: 10,
      imageWidth: 7,
      containerWidth: 5,
      containerHeight: 3,
      poolName : 'drate',
      bgUrl : 'https://static.vecteezy.com/system/resources/previews/002/135/714/non_2x/blue-honeycomb-abstract-background-wallpaper-and-texture-concept-vector.jpg',
      mode: false,
      flipTolerance: 3,
      flipRewardMultipler: 2,
      tags :  "feral -cub -young -human -mlp -diaper -scat -gore -vore",
      biggerThanScore: 20,
      numberOfPosts: 8,
      selectedAnimationOption: "nogifs"
    }

  }

  public get currencyScore(): number {
    return this._currencyScore;
  }
  public set currencyScore(value: number) {
    this._currencyScore = value;
  }

  public get scores(): Score[] {
    return this._scores;
  }

  public set scores(value: Score[]) {
    this._scores = value;
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
