import {Component, OnDestroy, OnInit} from '@angular/core';
import {DropDataService} from '../drop-data.service';
import {slideToLeft} from '../../router.animations';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [slideToLeft()],
  host: {'[@routerTransition]': ''}
})
export class SearchComponent implements OnInit, OnDestroy {

  dropdata: any;
  ddsub: any;
  nmsub: any;

  pagdata: any;

  itemname: string;
  page = 1;
  itemsperpage = 20;

  constructor(private route: ActivatedRoute, private ddService: DropDataService) {
    this.dropdata = [];
    this.pagdata = [];
  }

  ngOnInit() {
    this.ddsub = this.ddService.dropdata$.subscribe((data) => {
        this.fillData(data.filter(elem => elem.chance !== 0));
      }
    );
    this.nmsub = this.route.params.subscribe(params => {
      this.itemname = params['itemName'];
    });
    if (this.dropdata.length <= 0) {
      console.log('requesting data');
      this.ddService.requestData();
    }
  }

  ngOnDestroy() {
    this.ddsub.unsubscribe();
    this.nmsub.unsubscribe();
  }

  fillData(data) {
    this.dropdata = data.reduce(function (p, c) {
      if (!p.some(function (el) {
          return el.item === c.item && el.place === c.place && el.rarity === c.rarity;
        })) {
        p.push(c);
      }
      return p;
    }, []);
    if (this.itemname) {
      this.dropdata = this.dropdata.filter(elem => elem.item.toLowerCase().includes(this.itemname.toLowerCase()) ||
        elem.place.toLowerCase().includes(this.itemname.toLowerCase()));
    }

    for (let i = 1; i <= this.dropdata.length / 2; i++) {
      this.pagdata[i] = this.dropdata.slice(this.itemsperpage * (i - 1), this.itemsperpage * i);
    }
  }

  getDataPaginated() {
    return this.pagdata[this.page];
  }
}