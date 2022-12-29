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

  username;

  ratings = ['safe','questionable','explicit'];
  selectedRating;
  orders = ['random','score','favorites','date'];
  selectedOrder;

  tags = "feral -human -mlp -diaper -scat -gore -vore";
  ratio = 0;
  preserveRatio;

  biggerThanScore = 20;
  numberOfPosts = 8;
  refreshAfterSolving;
  animationOptions: any[];
  selectedAnimationOption = "nogifs";

  mode;
  visibleSidebar1;
  visibleSidebar2;
  visibleSidebar4;

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
  cardStorage : Card[];
  rawCards;
  urlBaseforSet = 'https://e621.net/posts.json?tags=set%3A';

  flippedCards: Card[] = [];
  timerRunning = false;

  timerStopStartEvent: Subject<void> = new Subject<void>();
  timerResetEvent: Subject<void> = new Subject<void>();

  matchedCount = 0;

  constructor(private communicationService: CommunicationService, public utils: UtilsService) {
    this.animationOptions = [{label: 'No gifs', value: 'nogifs'}, {label: 'Gifs', value: 'gifs'}, {label: 'Just Gifs', value: 'allgifs'}];
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
    this.cardStorage = JSON.parse(JSON.stringify(this.cards));
  }

  async getCards() {
    var jsonData;
    if (!this.mode) //If tags are not needed we get this url
   {
    await this.communicationService.getResponseFromUrl(this.urlBaseforSet+this.settings.poolName).then( data => {
      jsonData = data;
    }
    )
    this.cards = this.communicationService.extractCardsFromJSON(jsonData);
  } else { //If tags are needed we get this
    this.ratio = this.settings.imageWidth/this.settings.imageHeight;
    let tagUrl = this.utils.e621UrlBuilder(this.tags.split(" "),this.selectedOrder,this.selectedRating,this.biggerThanScore,this.preserveRatio?this.ratio:null,this.selectedAnimationOption);
    await this.communicationService.getResponseFromUrl(tagUrl).then(
      data => {
        jsonData = data;
      }
    )
    this.cards = this.communicationService.extractCardsFromJSON(jsonData,this.numberOfPosts);
  }
  this.emitResetTimerEvent()
  }

  async queryNewUrls() {
    await this.prepCards();
    console.log(this.cards);
  }

  resetGame() {
    if (this.refreshAfterSolving) {
      this.prepCards();
    } else {
      this.cards = JSON.parse(JSON.stringify(this.cardStorage));
      this.cards = this.communicationService.shuffleArray(this.cards);
      this.emitResetTimerEvent();
    }
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

    this.scores.push({username: this.username, cardcount: this.cards.length, time: JSON.parse(JSON.stringify($event))})
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
        }
      }

    }, 1000);
  }

}
