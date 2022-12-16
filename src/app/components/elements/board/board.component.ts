import { Card } from './../../../shared/models/card';
import { Component, OnInit } from '@angular/core';
import { CommunicationService } from 'src/app/shared/services/communication.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent  implements OnInit {

  cards : Card[];
  rawCards;
  url = 'https://e621.net/posts.json?tags=set%3Adrate';
  flippedCards: Card[] = [];
  rowHeight : number = 10;
  colNum : number = 3;
  imageWidth: number;

  matchedCount = 0;

  constructor(private communicationService: CommunicationService) {

  }

  async ngOnInit() {
    await this.getCards();
    this.cards = this.communicationService.doubleArray(this.cards)
    this.cards = this.communicationService.shuffleArray(this.cards);
    console.log(this.cards);
  }

  async getCards() {
    var jsonData;
    await this.communicationService.getResponseFromUrl(this.url).then( data => {
      jsonData = data;
    }
    )
    this.cards = this.communicationService.extractCardsFromJSON(jsonData);
  }

  cardClicked(index: number): void {
    const cardInfo = this.cards[index];

    if (cardInfo.state === 'default' && this.flippedCards.length < 2) {
      cardInfo.state = 'flipped';
      this.flippedCards.push(cardInfo);

      if (this.flippedCards.length > 1) {
        //this.checkForCardMatch();
      }

    } else if (cardInfo.state === 'flipped') {
      cardInfo.state = 'default';
      this.flippedCards.pop();

    }
  }

}
