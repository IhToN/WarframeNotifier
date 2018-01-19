import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {WarframeService} from './warframe.service';
import {LocalStorage} from 'ngx-webstorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
