import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {WarframeService} from '../warframe.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  platforms = ['pc', 'ps4', 'xb1'];

  constructor(public translate: TranslateService, public wfService: WarframeService) {
  }

  ngOnInit() {
  }
}
