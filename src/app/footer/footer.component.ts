import {Component, OnInit} from '@angular/core';
import {SessionStorage} from 'ngx-webstorage';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @SessionStorage('wfnCookie', false)
  cookiesAccepted: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  acceptCookies() {
    this.cookiesAccepted = true;
  }
}
