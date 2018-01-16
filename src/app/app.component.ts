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

  @LocalStorage('wfnLang')
  public lang;
  platform: string;

  constructor(private translate: TranslateService, private wfService: WarframeService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');

    /*const browserLang = translate.getBrowserLang();
    console.log('Browser Lang ' + browserLang);
    translate.use(translate.getLangs().includes(browserLang) ? browserLang : this.lang);*/
    translate.use(this.lang);
    this.lang = translate.currentLang;
  }

  ngOnInit(): void {
    this.platform = this.wfService.platform;
  }

  selectPlatform(platform) {
    this.wfService.selectPlatform(platform);
    this.platform = platform;
  }

  selectLanguage(language) {
    this.translate.use(this.translate.getLangs().includes(language) ? language : this.lang);
    this.lang = this.translate.currentLang;
  }
}
