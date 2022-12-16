export interface Card {
  id: number,
  imageUrl: string,
  state: 'default' | 'flipped' | 'matched';
}
