import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {WarframeService} from '../warframe.service';
import {slideToLeft} from '../../router.animations';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
  animations: [slideToLeft()],
  host: {'[@routerTransition]': ''}
})
export class BodyComponent implements OnInit, OnDestroy {

  wfData: { alerts: [''], news: [''], events: [''], earthCycle: [''], cetusCycle: [''] };
  wfsub: any;
  cont = {events: 0, alerts: 0, news: 0};

  // Inject HttpClient into your component or service.
  constructor(private wfService: WarframeService, private router: Router) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      const scrollToTop = window.setInterval(function () {
        const pos = window.pageYOffset;
        if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
        } else {
          window.clearInterval(scrollToTop);
        }
      }, 16); // how fast to scroll (this equals roughly 60 fps)
    });

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
