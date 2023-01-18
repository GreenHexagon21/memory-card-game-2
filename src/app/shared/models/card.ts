import { CardRarities } from "./enums/card-rarities";
import { CardStates } from "./enums/card-states";

export interface Card {
  id: number,
  imageUrl: string,
  state: CardStates,
  source:string,
  timesFlipped: number,
  value: number,
  rarity: CardRarities,
  special: string,
  modified: string;
}
