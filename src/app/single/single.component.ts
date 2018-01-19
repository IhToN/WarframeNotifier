import { Component, OnInit } from '@angular/core';
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
export class SingleComponent implements OnInit {

  constructor(private route: ActivatedRoute, private ddService: DropDataService) { }

  ngOnInit() {
  }

}
