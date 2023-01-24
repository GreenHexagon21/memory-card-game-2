import { StopperTime } from './../../../shared/models/stopper-time';
import { GlobalsService } from './../../../shared/services/globals.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Card } from 'src/app/shared/models/card';
import { CardRarities } from 'src/app/shared/models/enums/card-rarities';
import { map, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger("cardFlip", [
      state(
        "default",
        style({
          transform: "none"
        })
      ),
      state(
        "flipped",
        style({
          transform: "rotateY(180deg)"
        })
      ),
      state(
        "matched",
        style({
          transform: "rotateY(0deg) scale(0.05)",
          opacity: 0
        })
      ),
      transition("default => flipped", [animate("200ms")]),
      transition("flipped => default", [animate("200ms")]),
      transition("flipped => matched", [animate("300ms")])
    ])
  ]
})
export class CardComponent implements OnInit,OnDestroy{
  cardRarities = CardRarities;
  @Input() card: Card;
  @Input() bgImageUrl: string;

  @Output() cardClicked = new EventEmitter();

  timerSubscription: Subscription;
  cardTime: StopperTime;
  calculatedValue:number;
  timePool:number;
  startingDelay = 8;
  secondAverage = 6;

  constructor(public global:GlobalsService) { }

  ngOnInit(): void {
    this.calculatedValue = this.card.value;
    this.cardTime = this.global.getGlobalTime();
    this.timerSubscription = timer(0, 900).pipe(
      map(() => {
        this.calculateCardValue(); // load data contains the http request
      })
    ).subscribe();
    this.timePool = (this.startingDelay+(this.secondAverage*(this.global.getGlobalCards().length-3)))+((this.secondAverage*(this.global.getGlobalCards().length-2))/3);
  }

  calculateCardValue() {
    if (this.cardTime.ss > this.timePool/2) {
      this.calculatedValue = Math.round((1-((this.cardTime.ss-(this.timePool/2))/(this.timePool/2)))*this.card.value);
    }

  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }



}
