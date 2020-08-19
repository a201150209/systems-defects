import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';


const CREATING_DATE = 'Дата создания';
const SYSTEM_TYPE = 'System';
const CRITICALITY_TYPE = 'Критичность';

const filterClass = {
  startDate: 'filters__filter-creation-start-date',
  endDate: 'filters__filter-creation-end-date',
  systemType: 'filters__filter-system-type',
  criticalityType: 'filters__filter-criticality-type',
};

const filterStatus = {
  startDate: {
    value: 0,
    isActive: false,
  },
  endDate: {
    value: Infinity,
    isActive: false,
  },
  systemType: {
    value: '',
    isActive: false,
  },
  criticalityType: {
    value: '',
    isActive: false,
  },
};

const sources = require('./defects.json');

let sourcesCopy = sources.slice();

const test = {
  "ID": 102,
  "System": "System2",
  "Summary": "just text",
  "Состояние": "Закрыт",
  "Найдено при": "SystemTest",
  "Критичность": "Низкий",
  "Тип Дефекта": "ПО",
  "Дата создания": "2015-03-17 00:00:00.0000000",
  "Дата изменения": "2017-01-12 19:56:14.0000000",
  "Дата закрытия": "2015-04-22 00:00:00.0000000",
  "Метод обнаружения": "Не назначен",
  "reopens_amount": null
};

const updateStartDate = (date) => {
  if (date) {
    filterStatus.startDate.value = Date.parse(date);
    filterStatus.startDate.isActive = true;
  } else {
    filterStatus.startDate.isActive = false;
  }
};

const updateEndDate = (date) => {
  if (date) {
    filterStatus.endDate.value = Date.parse(date);
    filterStatus.endDate.isActive = true;
  } else {
    filterStatus.endDate.isActive = false;
  }
};

const updateSystemType = (type) => {
  if (type) {
    filterStatus.systemType.value = type;
    filterStatus.systemType.isActive = true;
  } else {
    filterStatus.systemType.isActive = false;
  }
};

const updateCriticalityType = (type) => {
  if (type) {
    filterStatus.criticalityType.value = type;
    filterStatus.criticalityType.isActive = true;
  } else {
    filterStatus.criticalityType.isActive = false;
  }
};


const filterSources = () => {

  sourcesCopy = sources.filter((item) => {
    const currentDate = Date.parse(item[CREATING_DATE]);

    let condition1 = true;
    if (filterStatus.startDate.isActive) {
      condition1 = currentDate >= filterStatus.startDate.value;
    };

    let condition2 = true;
    if (filterStatus.endDate.isActive) {
      condition2 = currentDate <= filterStatus.endDate.value;
    }

    let condition3 = true;
    if (filterStatus.systemType.isActive) {
      condition3 = item[SYSTEM_TYPE] === filterStatus.systemType.value;
    }

    let condition4 = true;
    if (filterStatus.criticalityType.isActive) {
      condition4 = item[CRITICALITY_TYPE] === filterStatus.criticalityType.value;
    }

    return condition1 && condition2 && condition3 && condition4;

  });
  console.log(sourcesCopy);
  console.log(filterStatus);
};

const checker = {
  isStartDate: (element) => {
    return element.classList.contains(filterClass.startDate);
  },
  isEndDate: (element) => {
    return element.classList.contains(filterClass.endDate);
  },
  isSystemType: (element) => {
    return element.classList.contains(filterClass.systemType);
  },
  isCriticalityType: (element) => {
    return element.classList.contains(filterClass.criticalityType);
  }
};


const filtersElement = document.body.querySelector('#chart-filters');
filtersElement.addEventListener('blur', (evt) => {

  if (checker.isStartDate(evt.target)) {
    updateStartDate(evt.target.value);
  } else if (checker.isEndDate(evt.target)) {
    updateEndDate(evt.target.value);
  } else if (checker.isSystemType(evt.target)) {
    updateSystemType(evt.target.value);
  } else if (checker.isCriticalityType(evt.target)) {
    updateCriticalityType(evt.target.value);
  } else {
    return false;
  }

  filterSources();

}, true);



/*
am4core.useTheme(am4themes_animated);
let chart = am4core.create('chartdiv', am4charts.XYChart);
chart.hiddenState.properties.opacity = 0;
chart.data = [
  {
    month: 'jan',
    cases: 15,
    system: 'sustem'
  },
  {
    month: 'feb',
    cases: 3,
    system: 'sustem'
  }
];

let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.dataFields.category = 'month';
categoryAxis.renderer.minGridDistance = 40;
categoryAxis.fontSize = 11;

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.min = 0;
valueAxis.max = 15;
valueAxis.strictMinMax = true;
valueAxis.renderer.minGridDistance = 30;

//axis break
let axisBreak = valueAxis.axisBreaks.create();
axisBreak.startValue = 0;
axisBreak.endValue = 20;
//axisBreak.breakSize = 0.005;

// fixed axis break
let d = (axisBreak.endValue - axisBreak.startValue) / (valueAxis.max - valueAxis.min);
axisBreak.breakSize = 0.05 * (1 - d) / d; // 0.05 means that the break will take 5% of the total value axis height

// make break expand on hover
let hoverState = axisBreak.states.create('hover');
hoverState.properties.breakSize = 1;
hoverState.properties.opacity = 0.1;
hoverState.transitionDuration = 1500;

axisBreak.defaultState.transitionDuration = 1000;

let series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.categoryX = 'month';
series.dataFields.valueY = 'cases';
series.columns.template.tooltipText = '{valueY.value}';
series.columns.template.tooltipY = 0;
series.columns.template.strokeOpacity = 0;

// as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
series.columns.template.adapter.add('fill', function (fill, target) {
  return chart.colors.getIndex(target.dataItem.index);
});*/