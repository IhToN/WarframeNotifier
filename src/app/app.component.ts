import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import * as WorldState from 'warframe-worldstate-parser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  apiurl = 'https://atalgaba.com/api.php?url=';

  lang: string;
  platform: string;
  wfData: any;

  constructor(private http: HttpClient, private translate: TranslateService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(translate.getLangs().includes(browserLang) ? browserLang : 'en');
    this.lang = translate.currentLang;

    this.platform = 'pc';

    this.requestData();
  }

  ngOnInit(): void {
    setInterval(this.requestData(), 60 * 1000);
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
      // Read the result field from the JSON response.
      this.wfData = new WorldState(JSON.stringify(data));
      console.log(this.wfData);
    });
  }

  selectPlatform(platform) {
    this.platform = platform;
    this.requestData();
  }

  selectLanguage(language) {
    this.translate.use(this.translate.getLangs().includes(language) ? language : 'en');
    this.lang = this.translate.currentLang;
  }
}
