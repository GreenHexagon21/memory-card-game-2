export interface Settings {
  matchCountNeeded: number,
  imageHeight : number,
  imageWidth: number,
  containerWidth : number,
  containerHeight: number,
  poolName : string,
  bgUrl : string,
  mode: boolean,
  tags?: string,
  preserveRatio?: string,
  selectedRating?: string,
  selectedOrder?: string
  biggerThanScore?: number,
  numberOfPosts?: number,
  refreshAfterSolving? : boolean,
  selectedAnimationOption?: string,
  username?: string
}
