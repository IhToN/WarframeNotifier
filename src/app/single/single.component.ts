import {Component, OnDestroy, OnInit} from '@angular/core';
import {slideToLeft} from '../../router.animations';
import {ActivatedRoute} from '@angular/router';
import {DropDataService} from '../drop-data.service';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.css'],
  animations: [slideToLeft()],
  host: {'[@routerTransition]': ''}
})
export class SingleComponent implements OnInit, OnDestroy {

  dropdata: any;
  ddsub: any;
  nmsub: any;
  itemname: string;

  constructor(private route: ActivatedRoute, private ddService: DropDataService) {
    this.dropdata = [];
  }

  ngOnInit() {
    this.ddsub = this.ddService.dropdata$.subscribe((data) => {
        this.dropdata = data.filter(elem => elem.chance !== 0 && elem.item.toLowerCase() === this.itemname.toLowerCase());
        console.log(this.dropdata);
      }
    );
    this.nmsub = this.route.params.subscribe(params => {
      this.itemname = params['itemName'];
    });
    if (this.dropdata.length <= 0) {
      this.ddService.requestData();
    }
  }

  ngOnDestroy() {
    this.ddsub.unsubscribe();
    this.nmsub.unsubscribe();
  }

}
