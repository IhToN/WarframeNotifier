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

  constructor(public translate: TranslateService, private wfService: WarframeService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');

    /*const browserLang = translate.getBrowserLang();
    console.log('Browser Lang ' + browserLang);
    translate.use(translate.getLangs().includes(browserLang) ? browserLang : this.lang);*/
    translate.use(wfService.language);
    wfService.selectLanguage(translate.currentLang);
  }

  ngOnInit(): void {
  }
}
