import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  @Input() startStopEvent: Observable<void>;
  private eventsSubscription: Subscription;

  ngOnInit(){
    this.eventsSubscription = this.startStopEvent.subscribe(() => this.clickHandler());
  }

  mm = 0;
  ss = 0;
  ms = 0;
  isRunning = false;
  timerId;

  clickHandler() {
    if (!this.isRunning) {
      this.timerId = setInterval(() => {
        this.ms++;

        if (this.ms >= 100) {
          this.ss++;
          this.ms = 0;
        }
        if (this.ss >= 60) {
          this.mm++;
          this.ss = 0
        }
      }, 10);
    } else {
      clearInterval(this.timerId);
    }
    this.isRunning = !this.isRunning;
  }

  format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

}
