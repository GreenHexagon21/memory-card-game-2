import { StopperTime } from './../../../shared/models/stopper-time';
import { Score } from './../../../shared/models/score';
import { Settings } from './../../../shared/models/settings';
import { Card } from './../../../shared/models/card';
import { Component, OnInit } from '@angular/core';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { Subject } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent  implements OnInit {

  ratings = ['safe','questionable','explicit'];
  selectedRating;
  orders = ['random','score','favorites','date'];
  selectedOrder;

  tags = "feral -human";

  biggerThanScore = 20;
  numberOfPosts = 8;
  refreshAfterSolving;

  checked1;
  visibleSidebar1;
  visibleSidebar2;

  settings: Settings = {
    imageHeight: 10,
    imageWidth: 7,
    containerWidth: 5,
    containerHeight: 3,
    poolName : 'drate',
    bgUrl : 'https://static.vecteezy.com/system/resources/previews/002/135/714/non_2x/blue-honeycomb-abstract-background-wallpaper-and-texture-concept-vector.jpg'
  }
  scores : Score[] = [];
  cards : Card[];
  rawCards;
  urlBaseforSet = 'https://e621.net/posts.json?tags=set%3A';

  flippedCards: Card[] = [];
  timerRunning = false;

  timerStopStartEvent: Subject<void> = new Subject<void>();
  timerResetEvent: Subject<void> = new Subject<void>();

  matchedCount = 0;

  constructor(private communicationService: CommunicationService, public utils: UtilsService) {

  }

  async ngOnInit() {
    await this.prepCards();
    if(JSON.parse(localStorage.getItem('scores'))) {
      this.scores = JSON.parse(localStorage.getItem('scores'))
    }
    console.log(this.cards);
  }

  async prepCards() {
    await this.getCards();
    this.cards = this.communicationService.doubleArray(this.cards)
    this.cards = this.communicationService.shuffleArray(this.cards);
  }

  async getCards() {
    var jsonData;
    await this.communicationService.getResponseFromUrl(this.urlBaseforSet+this.settings.poolName).then( data => {
      jsonData = data;
    }
    )
    this.cards = this.communicationService.extractCardsFromJSON(jsonData);
  }

  async queryNewUrls() {
    await this.prepCards();
    console.log(this.cards);
  }

  async resetGame() {
    await this.prepCards();
    this.emitResetTimerEvent();
  }


  emitTimerEvent() {
    this.timerStopStartEvent.next();
  }

  emitResetTimerEvent() {
    this.timerResetEvent.next();
  }

  saveSettings() {
    localStorage.setItem('settings',JSON.stringify(this.settings));
  }
  loadSettings() {
    this.settings = JSON.parse(localStorage.getItem('settings'));
    this.prepCards();
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
  saveTime($event : StopperTime) {

    this.scores.push({username: '', cardcount: this.cards.length, time: JSON.parse(JSON.stringify($event))})
    localStorage.setItem('scores',JSON.stringify(this.scores));
    console.log(this.scores);
  }
  deleteScores() {
    localStorage.removeItem('scores')
    this.scores = [];
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
          this.matchedCount = 0;
          console.log("end");
        }
      }

    }, 1000);
  }

}
