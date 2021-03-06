import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';

function pad2(number) {
  return (Math.abs(number) < 10 ? '0' : '') + Math.abs(number);
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit, OnDestroy {
  @Input() alert: any;
  status = 'INPROGRESS';
  timeText = '';
  progressValue = 100;

  starttime: any;
  endtime: any;

  interval: any;

  constructor() {
  }

  ngOnInit() {
    this.starttime = moment.unix(this.alert.activation.getTime() / 1000);
    this.endtime = moment.unix(this.alert.expiry.getTime() / 1000);

    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  formatTimeText(duration) {
    if (duration.days() !== 0) {
      return pad2(duration.days()) + 'd ' + pad2(Math.abs(duration.hours())) + 'h ' + pad2(Math.abs(duration.minutes())) + 'm '
        + pad2(Math.abs(duration.seconds())) + 's';
    } else if (duration.hours() !== 0) {
      return pad2(duration.hours()) + 'h ' + pad2(Math.abs(duration.minutes())) + 'm '
        + pad2(Math.abs(duration.seconds())) + 's';
    } else if (duration.minutes() !== 0) {
      return pad2(duration.minutes()) + 'm ' + pad2(Math.abs(duration.seconds())) + 's';
    } else {
      return pad2(duration.seconds()) + 's';
    }
  }

  updateTime() {
    if (moment() < this.starttime) {
      const duration = moment.duration(this.starttime.diff(moment(), 'seconds'), 'seconds');
      this.timeText = this.formatTimeText(duration);
      this.status = 'START';
    } else if (this.starttime < moment()) {
      const duration = moment.duration(this.endtime.diff(moment(), 'seconds'), 'seconds');
      this.timeText = this.formatTimeText(duration);
      if (this.endtime < moment()) {
        this.status = 'EXPIRED';
      } else {
        this.status = 'INPROGRESS';
      }

      const full = this.starttime.diff(this.endtime, 'seconds');
      const long = this.starttime.diff(moment(), 'seconds');
      this.progressValue = Math.ceil(long * 100 / full);
      if (this.progressValue < 30) {
        this.progressValue = 30;
      }
    }
  }
}
