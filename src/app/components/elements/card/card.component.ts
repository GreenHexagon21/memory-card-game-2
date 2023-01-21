import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from 'src/app/shared/models/card';
import { CardRarities } from 'src/app/shared/models/enums/card-rarities';

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
          transform: "scale(0.05)",
          opacity: 0
        })
      ),
      transition("default => flipped", [animate("200ms")]),
      transition("flipped => default", [animate("200ms")]),
      transition("* => matched", [animate("300ms")])
    ])
  ]
})
export class CardComponent {
  cardRarities = CardRarities;
  @Input() card: Card;
  @Input() bgImageUrl: string;

  @Output() cardClicked = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }



}
