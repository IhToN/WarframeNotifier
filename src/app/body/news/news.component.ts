import {Component, Input, OnInit} from '@angular/core';
import {WarframeService} from '../../warframe.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  @Input() news: any;
  wfs: any;

  constructor(private wfService: WarframeService) {
    this.wfs = wfService;
  }

  ngOnInit() {
    console.log(this.news);
  }



}
