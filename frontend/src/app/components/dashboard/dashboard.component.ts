import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { WebsocketService } from '../../services/websocket.service';
import { BackendService } from '../../services/backend.service';
import { sensorParamNames } from '../../models/config';
import { Observable, interval, timer } from 'rxjs';
import { ChartType, ChartOptions } from 'chart.js';
import * as pluginAnnotation from 'chartjs-plugin-annotation';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {

  @ViewChild('sideDrawer') sideDrawer !: MatSidenav;
  sideNavBarOptions: any = [];
  subscription !: any
  loggedInUser !: any;
  graphOptions: any = ['line', 'bar', 'number'];
  timePeriodOptions: any = ['day', 'weeks', 'months', 'years'];
  firstTimeChange: boolean = false;
  maxDate = new Date();
  count: number = 0;
  masterData !: any;
  allDates: any = [];
  groudpedDates: any = [];
  annotations: any = [
    { "value": 12, "color": "red" },
    { "value": 35, "color": "red" },
    { "value": 17, "color": "yellow" },
    { "value": 30, "color": "yellow" },
    { "value": 19, "color": "green" },
    { "value": 26, "color": "green" }
  ];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 20,
            yMax: 20,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 4,
          }
        },
      },
    },

  };

  lineChartType: ChartType = "line";
  barChartType: ChartType = "bar";

  constructor(private socketService: WebsocketService, private service: BackendService) { }

  ngOnInit(): void {
    this.loggedInUser = this.service.loggedInUser;
    this.sidebarInit();
    const source = interval(3000);
    this.subscription = source.subscribe(() => {
      this.updateDashboard("data");
    });
    this.service.getAllData().subscribe({
      next: (response: any) => {
        if (response.successFlag) {
          this.masterData = response.data
          this.masterData.forEach((item: any) => { this.allDates.push(new Date(this.dateFormater(item.date))) });
          this.dateCategorizer();
        }
      }
    });

  }

  sidebarInit() {
    for (let param of sensorParamNames) {
      let graphType = this.graphOptions[Math.floor(Math.random() * this.graphOptions.length)];
      if (graphType === 'line')
        graphType = this.lineChartType;
      else
        if (graphType === 'bar')
          graphType = this.barChartType
        else
          graphType = 'number'
      this.sideNavBarOptions.push({
        'id': param.id,
        'name': param.name,
        'state': true,
        'graphType': graphType,
        'timePeriod': 'day',
        'data': [{ data: [], label: 'Data' }],
        'labels': [],
        'options': this.lineChartOptions,
        'prevData': [{ data: [], label: 'Data' }],
        'prevLabels': [],
        'curData': [{ data: [], label: 'Data' }],
        'curLabels': []
      })
    }
  }

  updateDashboard(data: any) {
    if (!!!data) return;
    data = {
      "J01": Math.random() * 100,
      "J02": Math.random() * 50,
      "J03": Math.random() * 50,
      "J04": Math.random() * 100,
      "J05": Math.random() * 100,
      "J06": Math.random() * 100,
      "J08": Math.random() * 100,
      "J09": Math.random() * 100,
    }
    //data = this.dataFormater(data.message)
    //this.service.postIotData(data).subscribe();
    Object.keys(data).forEach((key: any) => {
      let sideNavItem = this.sideNavBarOptions.find((item: any) => item.id === key);
      if (sideNavItem) {
        sideNavItem.curData[0].data.push(data[key]);
        sideNavItem.curLabels.push(this.getCurrentTime());

        if (sideNavItem.timePeriod === 'day') {
          sideNavItem.data[0].data = [...sideNavItem.curData[0].data]
          sideNavItem.labels = [...sideNavItem.curLabels]
        }

        if (sideNavItem.graphType === this.lineChartType)
          this.addAnnotations(sideNavItem)
        else
          if (sideNavItem.graphType === this.barChartType && sideNavItem.timePeriod === 'day')
            sideNavItem.data = [sideNavItem.data[0]];

      }
    })
  }


  graphTypeSetter(graphType: string, id: string) {
    let sideNavItem!: any
    this.sideNavBarOptions.forEach((item: any) => {
      if (item.id === id)
        sideNavItem = item
    });

    if (sideNavItem) {
      if (graphType === 'line') {
        this.addAnnotations(sideNavItem);
        sideNavItem.graphType = this.lineChartType;
      }
      else
        if (graphType === 'bar') {
          sideNavItem.graphType = this.barChartType;
          sideNavItem.data = [sideNavItem.data[0]]

        }
      sideNavItem.data[0].data = [...sideNavItem.data[0].data]
      sideNavItem.labels = [...sideNavItem.labels]

    }

  }

  timePeriodSetter(timePeriod: string, id: string) {


    let sideNavItem = this.sideNavBarOptions.find((item: any) => item.id === id);
    sideNavItem.timePeriod = timePeriod;
    if (timePeriod === 'day')
      return;

    let data: any = [], labels: any = [];
    let datesGroup = this.groudpedDates[timePeriod];
    Object.keys(datesGroup).forEach((date: any) => {
      labels.push(date);
      let sum = 0;
      datesGroup[date].forEach((dateItem: any) => {
        this.masterData.forEach((masterItem: any) => {
          if (masterItem.date === dateItem) {
            sum += masterItem.iotData[id].avgData;
          }
        })
      });
      data.push(sum / datesGroup[date].length);
    });



    sideNavItem.prevData[0].data = data;
    sideNavItem.prevLabels = labels;
    sideNavItem.data[0].data = [...sideNavItem.prevData[0].data];
    sideNavItem.labels = [...sideNavItem.prevLabels];

    if (sideNavItem.graphType === this.lineChartType)
      this.addAnnotations(sideNavItem);
    else
      if (sideNavItem.graphType === this.barChartType)
        sideNavItem.data = [sideNavItem.data[0]];


  }

  addAnnotations(sideNavItem: any) {
    for (let [index, annot] of this.annotations.entries()) {
      let size = sideNavItem.timePeriod === 'day' ? sideNavItem.curData[0].data.length : sideNavItem.prevData[0].data.length
      let annotArray = Array.from({ length: size }, () => annot.value);
      sideNavItem.data[index + 1] = {
        data: annotArray,
        borderColor: annot.color,
        borderWidth: 1,
        fill: false,
        pointRadius: 0
      }
    }
  }

  getCurrentTime() {
    let currentDate = new Date();

    let hours: any = currentDate.getHours();
    let minutes: any = currentDate.getMinutes();
    let seconds: any = currentDate.getSeconds();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    let currentTime = hours + ':' + minutes + ':' + seconds;
    return String(currentTime);
  }

  dateCategorizer() {

    let dates = this.allDates;

    const groupedDates: any = {
      weeks: {},
      months: {},
      years: {}
    };

    dates.forEach((date: any) => {
      const formattedDate = this.formatDate(date);
      //const formattedDate = dates;

      // Group by week
      const weekStartDate = new Date(date);
      weekStartDate.setDate(date.getDate() - date.getDay()); // Start of the week (Sunday)
      const formattedWeekStartDate = this.formatDate(weekStartDate);

      if (!groupedDates.weeks[formattedWeekStartDate]) {
        groupedDates.weeks[formattedWeekStartDate] = [];
      }
      groupedDates.weeks[formattedWeekStartDate].push(formattedDate);

      // Group by month
      const formattedMonth = `${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      if (!groupedDates.months[formattedMonth]) {
        groupedDates.months[formattedMonth] = [];
      }
      groupedDates.months[formattedMonth].push(formattedDate);

      // Group by year
      const formattedYear = String(date.getFullYear());
      if (!groupedDates.years[formattedYear]) {
        groupedDates.years[formattedYear] = [];
      }
      groupedDates.years[formattedYear].push(formattedDate);
    });

    this.groudpedDates = groupedDates;


    return groupedDates;
  }

  getCurrentDate() {
    let today: any = new Date();
    let yyyy: any = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    let formattedToday = dd + '-' + mm + '-' + yyyy;

    return formattedToday;
  }


  formatDate(date: any) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  dataFormater(data: any) {
    return JSON.parse(data.replace(/'/g, '"'))
  }

  dateFormater(date: any) {
    let temp = date.split('-');
    return temp[2] + '-' + temp[1] + '-' + temp[0];
  }


}
