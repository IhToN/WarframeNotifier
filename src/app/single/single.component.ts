import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {slideToLeft} from '../../router.animations';
import {ActivatedRoute, Router} from '@angular/router';
import {DropDataService} from '../drop-data.service';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.css'],
  animations: [slideToLeft()],
  host: {'[@routerTransition]': ''}
})
export class SingleComponent implements OnInit, AfterViewChecked, OnDestroy {

  dropdata: any;
  ddsub: any;
  nmsub: any;
  itemname: string;

  title: string;

  constructor(private route: ActivatedRoute, private router: Router, private ddService: DropDataService) {
    this.dropdata = [];
  }

  ngOnInit() {
    this.ddsub = this.ddService.dropdata$.subscribe((data) => {
        this.dropdata = data.filter(elem => elem.chance !== 0 && elem.item.toLowerCase() === this.itemname.toLowerCase() || elem.place.toLowerCase().includes(this.itemname.toLowerCase()));
        this.title = this.dropdata.length > 0 ? this.dropdata[0].item : '';
        console.log(this.title, this.dropdata);
      }
    );
    this.nmsub = this.route.params.subscribe(params => {
      this.itemname = params['itemName'];
      this.ddService.requestData();
    });
    if (this.dropdata.length <= 0) {
      this.ddService.requestData();
    }
  }

  ngAfterViewChecked() {
    if (this.dropdata.length <= 0) {
      this.router.navigate(['/search/' + this.itemname]);
    }
  }

  ngOnDestroy() {
    this.ddsub.unsubscribe();
    this.nmsub.unsubscribe();
  }

}
