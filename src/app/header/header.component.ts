import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() languages: any;
  @Input() currentLang: string;
  @Input() currentPlat: string;

  @Output() platformSelect = new EventEmitter<any>();
  @Output() langSelect = new EventEmitter<any>();

  platforms = ['pc', 'ps4', 'xb1'];

  constructor() {
  }

  ngOnInit() {
  }

  selectPlatform(platform) {
    this.platformSelect.emit(platform);
  }

  selectLanguage(language) {
    this.langSelect.emit(language);
  }
}
