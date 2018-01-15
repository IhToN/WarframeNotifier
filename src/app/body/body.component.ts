import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  @Input() wfData: any;

  // Inject HttpClient into your component or service.
  constructor() {
  }

  ngOnInit(): void {
  }
}
