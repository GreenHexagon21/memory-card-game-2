export interface Settings {
  matchCountNeeded: number,
  imageHeight : number,
  imageWidth: number,
  containerWidth : number,
  containerHeight: number,
  poolName : string,
  bgUrl : string,
  mode: boolean,
  flipTolerance: number,
  flipRewardMultipler: number,
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
