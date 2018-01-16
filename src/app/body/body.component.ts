import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {WarframeService} from '../warframe.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  wfData: any;

  // Inject HttpClient into your component or service.
  constructor(private wfService: WarframeService) {
    this.wfService.wfData$.subscribe((data) => {
        this.wfData = data; // And he have data here too!
      }
    );
  }

  ngOnInit(): void {
    this.wfService.requestData();
  }
}
