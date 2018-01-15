import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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

  requestData() {
    this.http.get('https://ws.warframestat.us/' + this.platform).subscribe(data => {
      // Read the result field from the JSON response.
      this.wfData = data;
      console.log(this.wfData);
    });
  }

  selectPlatform(platform) {
    this.platform = platform;
  }

  selectLanguage(language) {
    this.translate.use(this.translate.getLangs().includes(language) ? language : 'en');
    this.lang = this.translate.currentLang;
  }
}
