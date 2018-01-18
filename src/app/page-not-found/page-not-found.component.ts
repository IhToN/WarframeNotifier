import { Component, OnInit } from '@angular/core';
import {slideToLeft} from '../../router.animations';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css'],
  animations: [slideToLeft()],
  host: {'[@routerTransition]': ''}
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
