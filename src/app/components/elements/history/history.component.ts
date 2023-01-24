import { Component } from '@angular/core';
import { GlobalsService } from 'src/app/shared/services/globals.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  constructor(public global: GlobalsService,public utils:UtilsService ) {
  }

  deleteScores() {
    localStorage.removeItem('scores')
    this.global.scores = [];
  }
}
