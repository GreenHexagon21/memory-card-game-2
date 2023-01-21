import { GlobalsService } from './../../../shared/services/globals.service';
import { StopperTime } from './../../../shared/models/stopper-time';
import { Score } from './../../../shared/models/score';
import { Settings } from './../../../shared/models/settings';
import { Card } from './../../../shared/models/card';
import { Component, OnInit } from '@angular/core';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { map, Subject, Subscription, timer } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { CardStates } from 'src/app/shared/models/enums/card-states';
import { Conditional } from '@angular/compiler';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent  implements OnInit {

  ratings = ['safe','questionable','explicit'];
  orders = ['random','score','favorites','date'];
  cardStates = CardStates;

  ratio = 0;

  animationOptions: any[];

  visibleSidebar1;
  visibleSidebar2;
  visibleSidebar4;

  settings: Settings = {
    matchCountNeeded: 2,
    imageHeight: 10,
    imageWidth: 7,
    containerWidth: 5,
    containerHeight: 3,
    poolName : 'drate',
    bgUrl : 'https://static.vecteezy.com/system/resources/previews/002/135/714/non_2x/blue-honeycomb-abstract-background-wallpaper-and-texture-concept-vector.jpg',
    mode: false,
    tags :  "feral -cub -young -human -mlp -diaper -scat -gore -vore",
    biggerThanScore: 20,
    numberOfPosts: 8,
    selectedAnimationOption: "nogifs"
  }

  scores : Score[] = [];
  cards : Card[];
  cardStorage : Card[];
  uniqueCards : Card[];
  urlBaseforSet = 'https://e621.net/posts.json?tags=set%3A';

  flippedCards: Card[] = [];
  timerRunning = false;

  timerStopStartEvent: Subject<void> = new Subject<void>();
  timerResetEvent: Subject<void> = new Subject<void>();

  timerGetTimerSubscription: Subscription;

  currentTime : StopperTime;
  formattedMM = "";
  formattedSS = "";
  formattedMS = "";

  matchedCount = 0;

  resetDialogDisplay = false;

  constructor(private communicationService: CommunicationService, public utils: UtilsService, public global: GlobalsService) {
    this.animationOptions = [{label: 'No gifs', value: 'nogifs'}, {label: 'Gifs', value: 'gifs'}, {label: 'Just Gifs', value: 'allgifs'}];
  }

  async ngOnInit() {
    await this.prepCards();
    if(JSON.parse(localStorage.getItem('scores'))) {
      this.scores = JSON.parse(localStorage.getItem('scores'))
    }

  }

  async prepCards() {
    await this.getCards();
    this.cards = this.utils.multiplyArray(this.cards,this.settings.matchCountNeeded)
    this.cards = this.utils.shuffleArray(this.cards);
    this.cardStorage = JSON.parse(JSON.stringify(this.cards));
  }

  async getCards() {
    var jsonData;
    if (!this.settings.mode) //If tags are not needed we get this url
   {
    await this.communicationService.getResponseFromUrl(this.urlBaseforSet+this.settings.poolName).then( data => {
      jsonData = data;
    }
    )
    this.global.setGlobalCards(this.communicationService.extractCardsFromJSON(jsonData));
    this.cards = this.global.getGlobalCards();
  } else { //If tags are needed we get this
    this.ratio = this.settings.imageWidth/this.settings.imageHeight;
    let tagUrl = this.utils.e621UrlBuilder(this.settings.tags.split(" "),this.settings.selectedOrder,this.settings.selectedRating,this.settings.biggerThanScore,this.settings.preserveRatio?this.ratio:null,this.settings.selectedAnimationOption);
    await this.communicationService.getResponseFromUrl(tagUrl).then(
      data => {
        jsonData = data;
      }
    )
    this.global.setGlobalCards(this.communicationService.extractCardsFromJSON(jsonData,this.settings.numberOfPosts));
    this.cards = this.global.getGlobalCards();
  }
  this.emitResetTimerEvent()
  }

  async queryNewUrls() {
    await this.prepCards();
    this.resetGame();
  }

  resetGame() {
    if(this.timerRunning) {
      this.emitTimerEvent();
      this.timerRunning = false;
    }
    if (this.settings.refreshAfterSolving) {
      this.prepCards();
    } else {
      this.cards = JSON.parse(JSON.stringify(this.cardStorage));
      this.cards = this.utils.shuffleArray(this.cards);
      this.emitResetTimerEvent();
    }
    this.resetDialogDisplay = false;
    this.matchedCount= 0;
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
    this.resetGame();
  }

  cardClicked(index: number): void {
    if(!this.timerRunning) {
      this.timerRunning = true;
      this.emitTimerEvent();
    }
    const cardInfo = this.cards[index];

    if (cardInfo.state === CardStates.default && this.flippedCards.length < this.settings.matchCountNeeded) {
      cardInfo.state = CardStates.flipped;
      this.flippedCards.push(cardInfo);

      if (this.flippedCards.length > (this.settings.matchCountNeeded-1)) {
        this.checkForCardMatch();
      }

    }
  }

  getCurrentTime($event : StopperTime) {
    this.currentTime = $event;
    //console.log(this.currentTime);
  }


  saveTime($event : StopperTime) {

    this.scores.push({username: this.settings.username, cardcount: this.cards.length, time: JSON.parse(JSON.stringify($event))})
    this.formattedMM = this.utils.format($event.mm);
    this.formattedSS = this.utils.format($event.ss);
    this.formattedMS = this.utils.format($event.ms);
    localStorage.setItem('scores',JSON.stringify(this.scores));
  }

  deleteScores() {
    localStorage.removeItem('scores')
    this.scores = [];
  }

  checkForCardMatch(): void {
    let state = CardStates.matched;
    let lastId;
    setTimeout(() => {
      this.flippedCards.forEach(card => {
        if(!lastId) {
          lastId = card.id;
        }
        if(lastId != card.id) {
          state = CardStates.flipped
        }
      });

      this.flippedCards.forEach(card => {
        card.state = state;
      });

      if (state == CardStates.matched) {
        this.matchedCount++;
        if (this.matchedCount === this.cards.length/this.settings.matchCountNeeded) {
          this.timerRunning = false;
          this.emitTimerEvent();
          this.matchedCount = 0;
          this.resetDialogDisplay = true;
        }
      } else {

        this.flippedCards.forEach(card => {
          card.state = CardStates.default;
        });
      }
      this.flippedCards = [];
    }, 1000);
  }
  sourceDisplay() {
    this.visibleSidebar4 = true;
    this.uniqueCards = [...new Map(this.cards.map(item => [item['id'], item])).values()]
    console.log(this.uniqueCards);
  }


}
