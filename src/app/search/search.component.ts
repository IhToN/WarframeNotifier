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
        this.dropdata = data.filter(elem => elem.chance !== 0);
        this.fillData();
      }
    );

    this.nmsub = this.route.params.subscribe(params => {
      this.itemname = params['itemName'];
    });
  }

  ngOnDestroy() {
    this.ddsub.unsubscribe();
    this.nmsub.unsubscribe();
  }

  fillData() {
    this.pagdata = this.dropdata.reduce(function (p, c) {
      if (!p.some(function (el) {
          return el.item === c.item && el.place === c.place && el.rarity === c.rarity && el.chance === c.chance;
        })) {
        p.push(c);
      }
      return p;
    }, []).sort(this.sort_by('item', {
      name: 'chance',
      primer: parseFloat,
      reverse: true
    }));
    if (this.itemname) {
      this.pagdata = this.pagdata.filter(elem => elem.item.toLowerCase().includes(this.itemname.toLowerCase())).sort(this.sort_by('item', {
        name: 'chance',
        primer: parseFloat,
        reverse: true
      }));
    }
  }

  getDataPaginated() {
    if (this.itemname) {
      return this.pagdata ? this.pagdata.slice(this.itemsperpage * (this.page - 1), this.itemsperpage * this.page) : [];
    }
    return this.pagdata ? this.pagdata.slice(this.itemsperpage * (this.page - 1), this.itemsperpage * this.page) : [];
  }

  // utility functions
  default_cmp = function (a, b) {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  };

  getCmpFunc = function (primer, reverse) {
    const dfc = this.default_cmp; // closer in scope
    let cmp = this.default_cmp;
    if (primer) {
      cmp = function (a, b) {
        return dfc(primer(a), primer(b));
      };
    }
    if (reverse) {
      return function (a, b) {
        return -1 * cmp(a, b);
      };
    }
    return cmp;
  };

  // actual implementation
  sort_by = function (...args) {
    const fields = [];
    const n_fields = args.length;
    let field, name, cmp;

    // preprocess sorting options
    for (let i = 0; i < n_fields; i++) {
      field = args[i];
      if (typeof field === 'string') {
        name = field;
        cmp = this.default_cmp;
      } else {
        name = field.name;
        cmp = this.getCmpFunc(field.primer, field.reverse);
      }
      fields.push({
        name: name,
        cmp: cmp
      });
    }

    // final comparison function
    return function (A, B) {
      let fname, result;
      for (let i = 0; i < n_fields; i++) {
        result = 0;
        field = fields[i];
        fname = field.name;

        result = field.cmp(A[fname], B[fname]);
        if (result !== 0) {
          break;
        }
      }
      return result;
    };
  };
}
