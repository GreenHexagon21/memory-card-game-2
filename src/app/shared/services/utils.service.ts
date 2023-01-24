import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  orders = {'score':'order%3Ascore', 'random':'order%3Arandom','favorites':'order%3Afavcount','date':'order%3Aid_desc'}
  ratings = {'safe': 'rating%3As','questionable':'rating%3Aq','explicit':'rating%3Ae'}
  gifOptions = {'nogifs':'-animation+filesize%3A100KB..4000KB','gifs':'-type%3Awebm+-type%3Amp4+-type%3Aswf+filesize%3A100KB..4000KB','allgifs':'type%3Agif+filesize%3A100KB..4000KB'}
  scorePiece = "score%3A>";
  ratioPiece = "ratio%3A";


  constructor() { }

  public format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }

  public e621UrlBuilder(tags: string[], order:string, rating:string,score:number, ratio?:number, gif?:string) {
    let base = "https://e621.net/posts.json?tags="
    var finalUrl = base
    tags.push(this.gifOptions[gif])
    tags.forEach( tag => {
      finalUrl = finalUrl+'+'+tag
    })
    finalUrl = finalUrl+'+'+this.orders[order];
    finalUrl = finalUrl+'+'+this.ratings[rating];
    finalUrl = finalUrl+'+'+this.scorePiece+score;
    if(ratio) {
      let minRatio;
      let maxRatio;
      minRatio = Math.round((ratio-0.05)*100)/100
      maxRatio = Math.round((ratio+0.05)*100)/100
      finalUrl = finalUrl+'+'+this.ratioPiece+minRatio+".."+maxRatio
    }
    return finalUrl;
  }

  multiplyArray(array: any[], multiplier:number) {
    let newArray : any[] = [];
    array.forEach( e => {
      for (let index = 0; index < multiplier; index++) {
        newArray.push({...e});
      }
    } )
    return newArray;
  }

  shuffleArray(anArray: any[]): any[] {
    return anArray.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

}
