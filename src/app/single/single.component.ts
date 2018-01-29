import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {slideToLeft} from '../../router.animations';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {DropDataService} from '../drop-data.service';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.css'],
  animations: [slideToLeft()],
  host: {'[@routerTransition]': ''}
})
export class SingleComponent implements OnInit, AfterViewChecked, OnDestroy {
  itemdropdata: any;
  cagedata: any;
  ddsub: any;
  nmsub: any;
  itemname: string;

  title: string;
  image: string;
  description: string;

  constructor(private route: ActivatedRoute, private router: Router, private ddService: DropDataService) {
    this.itemdropdata = [];
    this.cagedata = [];

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit() {
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
    this.ddsub = this.ddService.dropdata$.subscribe((data) => {
        this.itemdropdata = data.filter(elem => elem.chance !== 0 && elem.item.toLowerCase() === this.itemname.toLowerCase())
          .sort(this.ddService.sort_by({
            name: 'chance',
            primer: parseFloat,
            reverse: true
          }, 'place', 'item'));
        this.cagedata = this.groupBy(data.filter(elem => elem.place.toLowerCase()
          .includes(this.itemname.toLowerCase().split(' ').slice(0, 2).join(' ')))
          .sort(this.ddService.sort_by('place', {
            name: 'chance',
            primer: parseFloat,
            reverse: true
          }, 'item')), 'place');
        this.title = this.itemdropdata.length > 0 ? this.itemdropdata[0].item : '';

        const itemData = this.ddService.getItemData(this.itemname);
        this.image = itemData['thumbnail'];
        this.description = itemData['description'];
      }
    );
    this.nmsub = this.route.params.subscribe(params => {
      this.itemname = params['itemName'];
      this.ddService.requestData();
    });
    if (this.itemdropdata.length <= 0) {
      this.ddService.requestData();
    }
  }

  ngAfterViewChecked() {
    if (this.itemdropdata.length <= 0) {
      this.router.navigate(['/search/' + this.itemname]);
    }
  }

  ngOnDestroy() {
    this.ddsub.unsubscribe();
    this.nmsub.unsubscribe();
  }

  groupBy(list, discriminator, delimiter = '') {
    return list.reduce((acc, payload) => {
      const /** @type {?} */ key = this.extractKeyByDiscriminator(discriminator, payload, delimiter);
      acc[key] = Array.isArray(acc[key])
        ? acc[key].concat([payload])
        : [payload];
      return acc;
    }, {});
  }

  extractKeyByDiscriminator(discriminator, payload, delimiter) {
    if (typeof discriminator === 'function') {
      return ((discriminator))(payload);
    }
    if (Array.isArray(discriminator)) {
      return discriminator.map(k => this.extractDeepPropertyByMapKey(payload, k)).join(delimiter);
    }
    return this.extractDeepPropertyByMapKey(payload, /** @type {?} */ (discriminator));
  }

  extractDeepPropertyByMapKey(obj, map) {
    const /** @type {?} */ keys = map.split('.');
    const /** @type {?} */ head = keys.shift();
    return keys.reduce((prop, key) => {
      return typeof prop !== 'undefined' && typeof prop[key] !== 'undefined'
        ? prop[key]
        : undefined;
    }, obj[head || '']);
  }
}
