import {Injectable, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';
import * as WorldState from 'warframe-worldstate-parser';
import {LocalStorage} from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class WarframeService implements OnInit {
  apiurl = 'https://atalgaba.com/api.php?url=';

  @LocalStorage('wfnPlatform', 'pc')
  platform: string;
  @LocalStorage('wfnLanguage', 'en')
  language: string;

  wfData$: Observable<any>;
  private wfData = new Subject<any>();

  interval: any;

  constructor(private http: HttpClient, private translate: TranslateService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');
    this.translate.use(this.language);

    this.wfData$ = this.wfData.asObservable();
    this.interval = setInterval(() => {
      this.requestData();
    }, 60 * 1000);
  }

  ngOnInit() {

  }

  selectPlatform(platform) {
    this.platform = platform;
    this.requestData();
  }

  selectLanguage(language) {
    this.translate.use(language);
    this.language = language;
  }

  getWFApi() {
    switch (this.platform) {
      case 'ps4':
        return 'http://content.ps4.warframe.com/dynamic/worldState.php';
      case 'xb1':
        return 'http://content.xb1.warframe.com/dynamic/worldState.php';
      case 'pc':
      default:
        return 'http://content.warframe.com/dynamic/worldState.php';
    }
  }

  requestData() {
    this.http.get(this.apiurl + this.getWFApi()).subscribe(data => {
      const wsData = new WorldState(JSON.stringify(data));
      this.wfData.next(wsData);
      console.log(data);
      console.log(wsData);
    });
  }

}
