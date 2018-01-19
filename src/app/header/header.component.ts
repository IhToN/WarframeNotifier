import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {WarframeService} from '../warframe.service';
import {DropDataService} from '../drop-data.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  platforms = ['pc', 'ps4', 'xb1'];
  dropdata: any;
  ddsub: any;

  searchField: any;
  searching = false;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

  constructor(private router: Router, public translate: TranslateService,
              public wfService: WarframeService, public ddService: DropDataService) {
    this.dropdata = [];
  }

  ngOnInit() {
    this.ddsub = this.ddService.dropdata$.subscribe((data) => {
        this.fillData(data.filter(elem => elem.chance !== 0));
      }
    );
    if (this.dropdata.length <= 0) {
      this.ddService.requestData();
    }
  }

  fillData(data) {
    this.dropdata = data.reduce(function (p, c) {
      if (!p.some(function (el) {
          return el.item === c.item;
        })) {
        p.push(c);
      }
      return p;
    }, []);
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .map(term => term.length < 2 ? [] : this.dropdata.slice()
        .filter((elem, pos, arr) => elem.item.toLowerCase().indexOf(term.toLowerCase()) > -1)
        .slice(0, 10)
      ).do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);

  formatter = (x: { name: string }) => x.name;

  selectItem(event: any) {
    this.router.navigate(['/single/' + event.item.item.toLowerCase()]);
  }
}
