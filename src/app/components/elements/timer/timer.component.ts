import { GlobalsService } from './../../../shared/services/globals.service';
import { UtilsService } from './../../../shared/services/utils.service';
import { StopperTime } from './../../../shared/models/stopper-time';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { map, Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {


  @Input() startStopEvent: Observable<void>;
  @Input() resetEvent: Observable<void>;
  @Input() getTime: Observable<void>;

  @Output() emitStopperTimeEnd = new EventEmitter<StopperTime>();
  @Output() emitStopperTime = new EventEmitter<StopperTime>();

  private eventsSubscription: Subscription;
  private resetEventsSubscription: Subscription;
  private getTimeSubscription: Subscription;
  private setTimerTimerSubscription: Subscription;

  stopperTime:StopperTime = {
    mm : 0,
    ss : 0,
    ms : 0
  }
  constructor(private utils: UtilsService, private globals: GlobalsService) { }


  ngOnInit(){
    this.eventsSubscription = this.startStopEvent.subscribe(() => this.clickHandler());
    this.resetEventsSubscription = this.resetEvent.subscribe(() => this.resetTimer());
    this.setGlobalTime();
  }
  isRunning = false;
  timerId;

  resetTimer() {
    this.stopperTime.mm = 0;
    this.stopperTime.ss = 0;
    this.stopperTime.ms = 0;
    this.isRunning = false;
  }

  setGlobalTime() {
    this.globals.setGlobalTime(this.stopperTime);
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
      this.emitStopperTime.emit(this.stopperTime);
      clearInterval(this.timerId);
    }
    this.isRunning = !this.isRunning;
  }
  format(number:number) {
    return this.utils.format(number);
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    this.resetEventsSubscription.unsubscribe();
  }

}
