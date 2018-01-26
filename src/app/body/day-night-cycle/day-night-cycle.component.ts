import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';

declare var jQuery: any;

function pad2(number) {
  return (Math.abs(number) < 10 ? '0' : '') + Math.abs(number);
}

@Component({
  selector: 'app-day-night-cycle',
  templateUrl: './day-night-cycle.component.html',
  styleUrls: ['./day-night-cycle.component.css']
})
export class DayNightCycleComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() earthData: any;
  earthEnd: any;
  earthTimeText = '';
  earthProgress = 100;
  @Input() cetusData: any;
  cetusEnd: any;
  cetusTimeText = '';
  cetusProgress = 100;

  interval: any;

  constructor() {
  }

  ngOnInit() {
    this.earthEnd = moment.unix(this.earthData.expiry.getTime() / 1000);
    this.cetusEnd = moment.unix(this.cetusData.expiry.getTime() / 1000);

    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  ngAfterViewInit() {
    this.loadIcons();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  loadIcons() {
    jQuery('.day-icon').addLiviconEvo({
      name: 'weather-sun.svg',
      style: 'filled',
      size: '80%',
      strokeStyle: 'round',
      strokeColor: '#ffcd00',
      strokeColorAlt: '#ffba39',
      fillColor: '#ffec00',
      colorsOnHover: 'custom',
      strokeWidthFactorOnHover: '1.5',
      eventType: 'none',
      eventOn: 'grandparent',
      autoPlay: true,
      duration: '15',
      repeat: 'loop',
      drawOnViewport: true,
      viewportShift: 'full'
    });

    jQuery('.night-icon').addLiviconEvo({
      name: 'weather-moon.svg',
      style: 'filled',
      size: '80%',
      strokeStyle: 'round',
      strokeColor: '#a8a8a8',
      strokeColorAction: '#1b89b3',
      strokeColorAlt: '#d5d5d5',
      strokeColorAltAction: '#69c4c6',
      fillColor: '#e3e3e3',
      fillColorAction: '#6bd1ff',
      colorsOnHover: 'custom',
      strokeWidthFactorOnHover: '1.5',
      eventType: 'none',
      eventOn: 'grandparent',
      autoPlay: true,
      duration: '15',
      repeat: 'loop',
      drawOnViewport: true,
      viewportShift: 'full'
    });
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
    this.updateEarthTime();
    this.updateCetusTime();
  }

  updateEarthTime() {
    this.earthTimeText = this.formatTimeText(moment.duration(this.earthEnd.diff(moment(), 'seconds'), 'seconds'));
    const full = Math.abs(moment().diff(this.earthEnd, 'seconds'));
    const long = 14400;

    this.earthProgress = Math.ceil((long - full) * 100 / long);
  }

  updateCetusTime() {
    this.cetusTimeText = this.formatTimeText(moment.duration(this.cetusEnd.diff(moment(), 'seconds'), 'seconds'));
    const full = Math.abs(moment().diff(this.cetusEnd, 'seconds'));
    const long = 14400;

    this.cetusProgress = Math.ceil((long - full) * 100 / long);
  }
}
