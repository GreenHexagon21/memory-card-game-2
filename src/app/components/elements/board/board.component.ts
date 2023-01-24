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
  lastScore: number;

  matchedCount = 0;

  resetDialogDisplay = false;

  constructor(private communicationService: CommunicationService, public utils: UtilsService, public global: GlobalsService) {
    this.animationOptions = [{label: 'No gifs', value: 'nogifs'}, {label: 'Gifs', value: 'gifs'}, {label: 'Just Gifs', value: 'allgifs'}];
  }

  async ngOnInit() {
    await this.prepCards();
    if(JSON.parse(localStorage.getItem('scores'))) {
      this.global.scores = JSON.parse(localStorage.getItem('scores'))
    }

  }

  async prepCards() {
    await this.getCards();
    this.cards = this.utils.multiplyArray(this.cards,this.global.settings.matchCountNeeded)
    this.cards = this.utils.shuffleArray(this.cards);
    this.cardStorage = JSON.parse(JSON.stringify(this.cards));
  }

  async getCards() {
    var jsonData;
    if (!this.global.settings.mode) //If tags are not needed we get this url
   {
    await this.communicationService.getResponseFromUrl(this.urlBaseforSet+this.global.settings.poolName).then( data => {
      jsonData = data;
    }
    )
    this.global.setGlobalCards(this.communicationService.extractCardsFromJSON(jsonData));
    this.cards = this.global.getGlobalCards();
  } else { //If tags are needed we get this
    this.ratio = this.global.settings.imageWidth/this.global.settings.imageHeight;
    let tagUrl = this.utils.e621UrlBuilder(this.global.settings.tags.split(" "),this.global.settings.selectedOrder,this.global.settings.selectedRating,this.global.settings.biggerThanScore,this.global.settings.preserveRatio?this.ratio:null,this.global.settings.selectedAnimationOption);
    await this.communicationService.getResponseFromUrl(tagUrl).then(
      data => {
        jsonData = data;
      }
    )
    this.global.setGlobalCards(this.communicationService.extractCardsFromJSON(jsonData,this.global.settings.numberOfPosts));
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
    if (this.global.settings.refreshAfterSolving) {
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
    localStorage.setItem('settings',JSON.stringify(this.global.settings));
  }
  loadSettings() {
    this.global.settings = JSON.parse(localStorage.getItem('settings'));
    this.prepCards();
    this.resetGame();
  }

  cardClicked(index: number): void {
    if(!this.timerRunning) {
      this.timerRunning = true;
      this.emitTimerEvent();
    }

    const cardInfo = this.cards[index];

    if (cardInfo.state === CardStates.default && this.flippedCards.length < this.global.settings.matchCountNeeded) {
      this.cards[index].timesFlipped++;
      cardInfo.state = CardStates.flipped;
      this.flippedCards.push(cardInfo);

      if (this.flippedCards.length > (this.global.settings.matchCountNeeded-1)) {
        this.checkForCardMatch();
      }

    }
  }

  getCurrentTime($event : StopperTime) {
    this.currentTime = $event;
    //console.log(this.currentTime);
  }


  saveTime($event : StopperTime) {

  }

  saveGlobalTime() {
    this.global.scores.push({username: this.global.settings.username, cardcount: this.cards.length,score:this.global.score, time: JSON.parse(JSON.stringify(this.global.getGlobalTime()))})
    this.formattedMM = this.utils.format(this.global.getGlobalTime().mm);
    this.formattedSS = this.utils.format(this.global.getGlobalTime().ss);
    this.formattedMS = this.utils.format(this.global.getGlobalTime().ms);
    localStorage.setItem('scores',JSON.stringify(this.global.scores));
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
        this.flippedCards.forEach(card => {
          this.global.score += (this.global.settings.flipTolerance-card.timesFlipped)>0 ? Math.round(card.value*(1+(this.global.settings.flipRewardMultipler-1)*((this.global.settings.flipTolerance-card.timesFlipped)/this.global.settings.flipTolerance))) : card.value;
        });
        this.matchedCount++;
        if (this.matchedCount === this.cards.length/this.global.settings.matchCountNeeded) {
          this.lastScore = this.global.score;
          this.saveGlobalTime();
          this.timerRunning = false;
          this.emitTimerEvent();
          this.matchedCount = 0;
          this.resetDialogDisplay = true;
          this.global.score = 0;
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
