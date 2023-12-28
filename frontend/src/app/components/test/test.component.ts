import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import * as pluginAnnotation from 'chartjs-plugin-annotation';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  public barChartPlugins:any = [pluginAnnotation];

  valueLeft = 5.33;
  valueRight = 4.0;
  devider = '2010';
  color = '#21B087';

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 10,
      },
    },
    plugins: {
      annotation: {
        annotations: [
          {
            type: 'line',
            scaleID: 'y-axis-0',
            yMin: this.valueLeft,
            yMax: this.valueLeft,
            xMax: 0,
            xMin: this.devider,
            borderColor: this.color,
            borderWidth: 2,
            label: {
              content: String(this.valueLeft),              
              backgroundColor: this.color,
              color: 'white',
            },
          },
          {
            type: 'line',
            scaleID: 'y-axis-0',
            yMin: this.valueRight,
            yMax: this.valueRight,
            xMax: this.devider,
            xMin: 6,
            borderColor: this.color,
            borderWidth: 2,
            label: {
              content: String(this.valueRight),              
              backgroundColor: this.color,
              color: 'white',
            },
          },
          {
            type: 'line',
            scaleID: 'x-axis-0',
            xMin: this.devider,
            xMax: this.devider,
            yMax: 9,
            yMin: 1,
            borderColor: this.color,
            borderWidth: 2,
            borderDash: [5, 10],
          },
        ],
      },
    },
  };
  public barChartLabels = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
  ];
  public barChartType: ChartType = 'line';
  public barChartLegend = false;

  public barChartData = [
    {
      data: [2, 9, 9, 6, 8, 8, 3],
      label: 'Test1Max',
      borderColor: '#FF000055',
      backgroundColor: '#FF000055',
      fill: +1,
    },
    {
      data: [1, 5, 8, 5, 6, 7, 2],
      label: 'Test1Med',
      borderColor: '#FF0000',
      backgroundColor: '#FF0000',
    },
    {
      data: [0, 1, 7, 4, 4, 6, 1],
      label: 'Test1Min',
      borderColor: '#FF000055',
      backgroundColor: '#FF000055',
      fill: +1,
    },
  ];

  constructor() {}

  onClick(event:any) {}
  ngOnInit() {}

  ngAfterViewInit() {}
}
