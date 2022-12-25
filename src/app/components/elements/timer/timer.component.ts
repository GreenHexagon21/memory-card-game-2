import { StopperTime } from './../../../shared/models/stopper-time';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {


  @Input() startStopEvent: Observable<void>;
  @Input() resetEvent: Observable<void>;
  private eventsSubscription: Subscription;
  private resetEventsSubscription: Subscription;
  stopperTime:StopperTime = {
    mm : 0,
    ss : 0,
    ms : 0
  }

  ngOnInit(){
    this.eventsSubscription = this.startStopEvent.subscribe(() => this.clickHandler());
    this.resetEventsSubscription = this.resetEvent.subscribe(() => this.resetTimer());
  }
  isRunning = false;
  timerId;

  resetTimer() {
    this.stopperTime.mm = 0;
    this.stopperTime.ss = 0;
    this.stopperTime.ms = 0;
    this.isRunning = false;
  }

  clickHandler() {
    if (!this.isRunning) {
      this.timerId = setInterval(() => {
        this.stopperTime.ms++;

        if (this.stopperTime.ms >= 100) {
          this.stopperTime.ss++;
          this.stopperTime.ms = 0;
        }
        if (this.stopperTime.ss >= 60) {
          this.stopperTime.mm++;
          this.stopperTime.ss = 0
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
    this.resetEventsSubscription.unsubscribe();
  }

}
