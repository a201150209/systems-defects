import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


const CREATING_DATE = 'Дата создания';
const SYSTEM_TYPE = 'System';
const CRITICALITY_TYPE = 'Критичность';

const сlass = {
  startDate: 'filters__filter-creation-start-date',
  endDate: 'filters__filter-creation-end-date',
  systemType: 'filters__filter-system-type',
  criticalityType: 'filters__filter-criticality-type',
};

const status = {
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

const checker = {
  isStartDate: (element) => {
    return element.classList.contains(сlass.startDate);
  },
  isEndDate: (element) => {
    return element.classList.contains(сlass.endDate);
  },
  isSystemType: (element) => {
    return element.classList.contains(сlass.systemType);
  },
  isCriticalityType: (element) => {
    return element.classList.contains(сlass.criticalityType);
  }
};

const sources = require('./defects.json');
let sourcesCopy = sources.slice();
let issuesByMonth = [];


const updateStartDate = (date) => {
  if (date) {
    status.startDate.value = Date.parse(date);
    status.startDate.isActive = true;
  } else {
    status.startDate.isActive = false;
  }
};

const updateEndDate = (date) => {
  if (date) {
    status.endDate.value = Date.parse(date);
    status.endDate.isActive = true;
  } else {
    status.endDate.isActive = false;
  }
};

const updateSystemType = (type) => {
  if (type) {
    status.systemType.value = type;
    status.systemType.isActive = true;
  } else {
    status.systemType.isActive = false;
  }
};

const updateCriticalityType = (type) => {
  if (type) {
    status.criticalityType.value = type;
    status.criticalityType.isActive = true;
  } else {
    status.criticalityType.isActive = false;
  }
};

const filterSources = () => {
  sourcesCopy = sources.filter((item) => {
    const currentDate = Date.parse(item[CREATING_DATE]);

    let condition1 = true;
    if (status.startDate.isActive) {
      condition1 = currentDate >= status.startDate.value;
    };

    let condition2 = true;
    if (status.endDate.isActive) {
      condition2 = currentDate <= status.endDate.value;
    }

    let condition3 = true;
    if (status.systemType.isActive) {
      condition3 = item[SYSTEM_TYPE] === status.systemType.value;
    }

    let condition4 = true;
    if (status.criticalityType.isActive) {
      condition4 = item[CRITICALITY_TYPE] === status.criticalityType.value;
    }

    return condition1 && condition2 && condition3 && condition4;

  });
};

const getTempIssuesByMonth = () => {
  //временный объект добавлен для быстродействия, иначе пришлось бы запускать цикл в цикле
  const tempData = {};
  sourcesCopy.forEach((item) => {
    const yearAndMonth = item[CREATING_DATE].substr(0, 7);
    //tempChartData[yearAndMonth] - issue counter
    if (!tempData[yearAndMonth]) {
      tempData[yearAndMonth] = 0;
    }
    tempData[yearAndMonth]++;
  });

  return tempData;
};

const getIssuesByMonth = (temp) => {
  const issuesByMonth = [];
  for (var key in temp) {
    if (temp.hasOwnProperty(key)) {
      const year = Number(key.substr(0, 4));
      const month = Number(key.substr(5, 7)) - 1;
      const date = new Date(year, month);
      const issue = temp[key];
      issuesByMonth.push({
        date,
        issue
      });
    }
  }

  issuesByMonth.sort((prev, next) => {
    return prev.date - next.date;
  });

  return issuesByMonth;
};

const setIssuesByMonth = () => {
  const tempData = getTempIssuesByMonth();
  issuesByMonth = getIssuesByMonth(tempData);
};

const drawChart = () => {
  /* Chart code */
  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end
  let chart = am4core.create('chart', am4charts.XYChart);
  chart.data = issuesByMonth;

  // Create axes
  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 60;

  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  let series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = 'issue';
  series.dataFields.dateX = 'date';
  series.tooltipText = '{issue}';

  series.tooltip.pointerOrientation = 'vertical';

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.snapToSeries = series;
  chart.cursor.xAxis = dateAxis;

  //chart.scrollbarY = new am4core.Scrollbar();
  chart.scrollbarX = new am4core.Scrollbar();

};

const drawTable = () => {
  var Tabulator = require('tabulator-tables');
  var table = new Tabulator("#source-table", {
    height: "311px",
    layout: "fitColumns",
    data: sources,
    rowFormatter: function (row) {
      if (row.getData().age >= 18) {
        row.getElement().classList.add("success");
      }
    },
    columns: [
      {title: "ID", field: "ID", headerFilter: "input"},
      {title: "System", field: "System", headerFilter: "input"},
      {title: "Summary", field: "Summary", headerFilter: "input"},
      {title: "Состояние", field: "Состояние", headerFilter: "input"},
      {title: "Найдено при", field: "Найдено при", headerFilter: "input"},
      {title: "Критичность", field: "Критичность", headerFilter: "input"},
      {title: "Тип Дефекта", field: "Тип Дефекта", headerFilter: "input"},
      {title: "Дата создания", field: "Дата создания", headerFilter: "input"},
      {title: "Дата изменения", field: "Дата изменения", headerFilter: "input"},
      {title: "Дата закрытия", field: "Дата закрытия", headerFilter: "input"},
      {title: "Метод обнаружения", field: "Метод обнаружения", headerFilter: "input"},
      {title: "reopens_amount", field: "reopens_amount", headerFilter: "input"},
    ],
  });
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
  setIssuesByMonth();
  drawChart();
}, true);


setIssuesByMonth();
drawChart();
drawTable();

