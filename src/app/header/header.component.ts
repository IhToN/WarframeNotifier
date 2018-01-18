import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {WarframeService} from '../warframe.service';
import {DropDataService} from '../drop-data.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  platforms = ['pc', 'ps4', 'xb1'];
  dropdata: any;

  searchField: any;

  constructor(public translate: TranslateService, public wfService: WarframeService, public ddService: DropDataService) {
    this.ddService.dropdata$.subscribe((data) => {
        this.dropdata = data; // And he have data here too!
        console.log(this.dropdata);
      }
    );
  }

  ngOnInit() {
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? [] : this.dropdata.slice()
        .reduce(function (p, c) {
          // if the next object's id is not found in the output array
          // push the object into the output array
          if (!p.some(function (el) {
              return el.item === c.item;
            })) {
            p.push(c);
          }
          return p;
        }, [])
        .sort((a, b) => a.item > b.item)
        .filter((v, pos, arr) => v.item.toLowerCase().indexOf(term.toLowerCase()) > -1)
        .slice(0, 10)
      );

  formatter = (x: { name: string }) => x.name;
}