import { Component } from '@angular/core';
import { GlobalsService } from 'src/app/shared/services/globals.service';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent {
  constructor(public global: GlobalsService) {
  }

}
