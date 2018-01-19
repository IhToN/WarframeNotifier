import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {WarframeService} from '../warframe.service';
import {slideToLeft} from '../../router.animations';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
  animations: [slideToLeft()],
  host: {'[@routerTransition]': ''}
})
export class BodyComponent implements OnInit, OnDestroy {

  wfData: any;
  wfsub: any;

  // Inject HttpClient into your component or service.
  constructor(private wfService: WarframeService) {
  }

  ngOnInit(): void {
    this.wfsub = this.wfService.wfData$.subscribe((data) => {
        this.wfData = data; // And he have data here too!
      }
    );
    this.wfService.requestData();
  }

  ngOnDestroy() {
    this.wfsub.unsubscribe();
  }
}
