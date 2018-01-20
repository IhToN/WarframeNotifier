import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {WarframeService} from '../warframe.service';
import {slideToLeft} from '../../router.animations';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
  animations: [slideToLeft()],
  host: {'[@routerTransition]': ''}
})
export class BodyComponent implements OnInit, OnDestroy {

  wfData: { alerts: [''], news: [''], events: [''] };
  wfsub: any;
  cont = { events: 0, alerts: 0, news: 0 };

  // Inject HttpClient into your component or service.
  constructor(private wfService: WarframeService) {
  }

  ngOnInit(): void {
    this.wfsub = this.wfService.wfData$.subscribe((data) => {
        this.wfData = data; // And he have data here too!
        this.cont.events = this.wfData.events.length;
        this.cont.alerts = this.wfData.alerts.length;
        this.cont.news = this.wfData.news.length;
      }
    );
    this.wfService.requestData();
  }

  ngOnDestroy() {
    this.wfsub.unsubscribe();
  }
}
