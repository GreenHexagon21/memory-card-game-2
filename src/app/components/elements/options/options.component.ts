import { Component } from '@angular/core';
import { GlobalsService } from 'src/app/shared/services/globals.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {


  constructor(public global: GlobalsService) {
  }
}
