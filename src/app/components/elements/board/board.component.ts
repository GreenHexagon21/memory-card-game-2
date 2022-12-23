import { Card } from './../../../shared/models/card';
import { Component, OnInit } from '@angular/core';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent  implements OnInit {

  cards : Card[];
  rawCards;
  urlBase = 'https://e621.net/posts.json?tags=set%3A';
  flippedCards: Card[] = [];
  imageHeight : number = 10;
  imageWidth: number = 7;
  containerWidth : number = 5;
  containerHeight: number = 3;
  poolName : string = 'drate';
  bgUrl : string = 'https://media.hearthpwn.com/attachments/5/248/warlords-cardback.png';
  timerRunning = false;

  timerEvent: Subject<void> = new Subject<void>();

  matchedCount = 0;

  constructor(private communicationService: CommunicationService) {

  }

  async ngOnInit() {
    await this.prepCards();
    console.log(this.cards);
  }

  async prepCards() {
    await this.getCards();
    this.cards = this.communicationService.doubleArray(this.cards)
    this.cards = this.communicationService.shuffleArray(this.cards);
  }

  async getCards() {
    var jsonData;
    await this.communicationService.getResponseFromUrl(this.urlBase+this.poolName).then( data => {
      jsonData = data;
    }
    )
    this.cards = this.communicationService.extractCardsFromJSON(jsonData);
  }

  async queryNewUrls() {
    await this.prepCards();
    console.log(this.cards);
  }


  emitTimerEvent() {
    this.timerEvent.next();
  }

  cardClicked(index: number): void {
    if(!this.timerRunning) {
      this.timerRunning = true;
      this.emitTimerEvent();
    }
    const cardInfo = this.cards[index];

    if (cardInfo.state === 'default' && this.flippedCards.length < 2) {
      cardInfo.state = 'flipped';
      this.flippedCards.push(cardInfo);

      if (this.flippedCards.length > 1) {
        this.checkForCardMatch();
      }

    }
  }
  checkForCardMatch(): void {
    setTimeout(() => {
      const cardOne = this.flippedCards[0];
      const cardTwo = this.flippedCards[1];
      const nextState = cardOne.id === cardTwo.id ? 'matched' : 'default';
      cardOne.state = cardTwo.state = nextState;

      this.flippedCards = [];
      if (nextState === 'matched') {
        this.matchedCount++;
        if (this.matchedCount === this.cards.length/2) {
          this.timerRunning = false;
          this.emitTimerEvent();
          console.log("end");
        }
      }

    }, 1000);
  }

}
