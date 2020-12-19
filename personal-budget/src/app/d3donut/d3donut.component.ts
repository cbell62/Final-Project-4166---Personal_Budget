import { Component, AfterViewInit } from '@angular/core';
import { DataService } from '../services/data.service';
import * as d3 from 'd3';

@Component({
  selector: 'pb-d3donut',
  templateUrl: './d3donut.component.html',
  styleUrls: ['./d3donut.component.scss']
})
export class D3donutComponent implements AfterViewInit {

  // private data = [s
  //   {title: 'Eat out', budget: '30'},
  //   {title: 'Rent', budget: '350'},
  //   {title: 'Grocery', budget: '90'},
  //   {title: 'Health/Medical', budget: '350'},
  //   {title: 'Entertainment', budget: '50'},
  //   {title: 'Clothing', budget: '100'},
  //   {title: 'Utilities', budget: '150'},
  // ];
  private data = [];
  private labels = [];
  private svg;
  private margin = 10;
  private width = 625;
  private height = 500;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;

  constructor(private dataService: DataService) { }


  ngAfterViewInit(): void {
    this.createSvg();
    // this.createColors();
    this.dataService.getAllBudgetData().subscribe((data) => {
      this.drawChart(data);
    });
    // this.drawChart();
  }

  private createSvg(): void {
    this.svg = d3.select('figure#pie')
    .append('svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .append('g')
    .attr(
      'transform',
      'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
    );
  }

  // private createColors(): void {
  //     this.colors = d3.scaleOrdinal()
  //     .domain(this.data.map(d => d.budget.toString()))
  //     .range(['#790149',
  //             '#005Fcc',
  //             '#00EBC1',
  //             '#A700FC',
  //             '#FF6E3A',
  //             '#FFDC3D',
  //             '#00B408',
  //             '#003D30']);
  // }

  private drawChart(data): void {

      for (let i = 0; i < data.length; i++) {
        this.labels[i] = data[i].title;
      }
      // console.log (this.labels);
      // console.log (data);

      this.colors = d3.scaleOrdinal()
      .domain(this.labels)
      .range(['#790149',
              '#005Fcc',
              '#00EBC1',
              '#A700FC',
              '#FF6E3A',
              '#FFDC3D',
              '#00B408',
              '#003D30']);

      // Compute the position of each group on the pie:
      const pie = d3.pie<any>().value((d: any) => Number(d.budget));

      // Build the pie chart
      this.svg
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(this.radius)
      )
      .attr('fill', (d, i) => (this.colors(i)))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px');

      // Add labels
      const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);

      this.svg
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('text')
      .text(d => d.data.title)
      .attr('transform', d => 'translate(' + labelLocation.centroid(d) + ')')
      .style('text-anchor', 'middle')
      .style('font-size', 15);
  }

}


