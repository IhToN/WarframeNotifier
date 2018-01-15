import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import moment = require('moment');

function pad2(number) {
  if (number >= 0 && number < 10) {
    return '0' + number;
  }
  if (number < 0 && number > -10) {
    return '-0' + Math.abs(number);
  }
  return number;
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit, OnDestroy {
  @Input() alert: any;
  colorType = 'info';
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

  updateTime() {
    if (moment() < this.starttime) {
      const duration = moment.duration(this.starttime.diff(moment(), 'seconds'), 'seconds');
      if (duration.days() !== 0) {
        this.timeText = 'Start: ' + pad2(duration.days()) + 'd ' + pad2(duration.hours()) + 'h ' + pad2(duration.minutes()) + 'm '
          + pad2(duration.seconds()) + 's';
      } else if (duration.hours() !== 0) {
        this.timeText = 'Start: ' + pad2(duration.hours()) + 'h ' + pad2(duration.minutes()) + 'm ' + pad2(duration.seconds()) + 's';
      } else {
        this.timeText = 'Start: ' + pad2(duration.minutes()) + 'm ' + pad2(duration.seconds()) + 's';
      }
      this.colorType = 'secondary';
    } else if (this.starttime < moment()) {
      const duration = moment.duration(this.endtime.diff(moment(), 'seconds'), 'seconds');
      if (duration.days() !== 0) {
        this.timeText = pad2(duration.days()) + 'd ' + pad2(Math.abs(duration.hours())) + 'h ' + pad2(Math.abs(duration.minutes())) + 'm '
          + pad2(Math.abs(duration.seconds())) + 's';
      } else if (duration.hours() !== 0) {
        this.timeText = pad2(duration.hours()) + 'h ' + pad2(Math.abs(duration.minutes())) + 'm '
          + pad2(Math.abs(duration.seconds())) + 's';
      } else if (duration.minutes() !== 0) {
        this.timeText = pad2(duration.minutes()) + 'm ' + pad2(Math.abs(duration.seconds())) + 's';
      } else if (duration.seconds() !== 0) {
        this.timeText = pad2(duration.seconds()) + 's';
      }
      if (this.endtime < moment()) {
        this.colorType = 'danger';
        this.timeText = 'Expired: ' + this.timeText;
      } else {
        this.colorType = 'success';

        const full = this.starttime.diff(this.endtime, 'seconds');
        const long = this.starttime.diff(moment(), 'seconds');
        this.progressValue = Math.ceil(long * 100 / full);
        if (this.progressValue < 30) {
          this.progressValue = 30;
        }
      }
    }
  }
}
