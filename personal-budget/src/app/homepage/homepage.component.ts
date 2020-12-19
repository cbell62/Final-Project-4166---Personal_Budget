import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DataService } from '../services/data.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  constructor(public dataService: DataService, public errorService: ErrorService) { }

  ngAfterViewInit(): void {
  }


}
