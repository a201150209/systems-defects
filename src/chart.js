import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {sources} from './sources.js';


const CREATING_DATE_NAME = `Дата создания`;
const SYSTEM_TYPE_NAME = `System`;
const CRITICALITY_TYPE_NAME = `Критичность`;
const START_DATE_CLASS = `filters__filter-creation-start-date`;
const END_DATE_CLASS = `filters__filter-creation-end-date`;
const SYSTEM_TYPE_CLASS = `filters__filter-system-type`;
const CRITICALITY_TYPE_CLASS = `filters__filter-criticality-type`;
const MONTH_SHIFT = 1;
const Index = {
  YEAR_START: 0,
  YEAR_END: 4,
  MONTH_START: 5,
  MONTH_END: 7,
};

const startDateFilterElement = document.body.querySelector(`.${START_DATE_CLASS}`);
const endDateFilterElement = document.body.querySelector(`.${END_DATE_CLASS}`);
const systemTypeFilterElement = document.body.querySelector(`.${SYSTEM_TYPE_CLASS}`);
const criticalityTypeFilterElement = document.body.querySelector(`.${CRITICALITY_TYPE_CLASS}`);
const filterButtonElement = document.body.querySelector(`#filter-button`);

const filterStatus = {
  startDate: {
    value: ``,
    isActive: false,
  },
  endDate: {
    value: ``,
    isActive: false,
  },
  systemType: {
    value: ``,
    isActive: false,
  },
  criticalityType: {
    value: ``,
    isActive: false,
  },
};

let sourcesCopy = sources.slice();
const issuesByMonth = [];

const updateStartDate = () => {
  if (startDateFilterElement.value) {
    filterStatus.startDate.value = Date.parse(startDateFilterElement.value);
    filterStatus.startDate.isActive = true;
  } else {
    filterStatus.startDate.isActive = false;
  }
};

const updateEndDate = () => {
  if (endDateFilterElement.value) {
    filterStatus.endDate.value = Date.parse(endDateFilterElement.value);
    filterStatus.endDate.isActive = true;
  } else {
    filterStatus.endDate.isActive = false;
  }
};

const updateSystemType = () => {
  if (systemTypeFilterElement.value) {
    filterStatus.systemType.value = systemTypeFilterElement.value;
    filterStatus.systemType.isActive = true;
  } else {
    filterStatus.systemType.isActive = false;
  }
};

const updateCriticalityType = () => {
  if (criticalityTypeFilterElement.value) {
    filterStatus.criticalityType.value = criticalityTypeFilterElement.value;
    filterStatus.criticalityType.isActive = true;
  } else {
    filterStatus.criticalityType.isActive = false;
  }
};

const filterSources = () => {
  sourcesCopy = sources.filter((item) => {
    const currentDate = Date.parse(item[CREATING_DATE_NAME]);

    let isStartDate = true;
    if (filterStatus.startDate.isActive) {
      isStartDate = currentDate >= filterStatus.startDate.value;
    }

    let isEndDate = true;
    if (filterStatus.endDate.isActive) {
      isEndDate = currentDate <= filterStatus.endDate.value;
    }

    let isSystemType = true;
    if (filterStatus.systemType.isActive) {
      isSystemType = item[SYSTEM_TYPE_NAME] === filterStatus.systemType.value;
    }

    let isCriticalityType = true;
    if (filterStatus.criticalityType.isActive) {
      isCriticalityType = item[CRITICALITY_TYPE_NAME] === filterStatus.criticalityType.value;
    }

    return isStartDate && isEndDate && isSystemType && isCriticalityType;
  });
};

// временный объект добавлен для быстродействия, иначе пришлось бы запускать цикл в цикле
// спорное решение, спросить как сделать лучше
const getTempIssuesByMonth = () => {
  const tempData = {};
  sourcesCopy.forEach((item) => {
    const yearAndMonth = item[CREATING_DATE_NAME].substr(Index.YEAR_START, Index.MONTH_END);
    // tempChartData[yearAndMonth] = issue counter
    if (!tempData[yearAndMonth]) {
      tempData[yearAndMonth] = 0;
    }
    tempData[yearAndMonth]++;
  });

  return tempData;
};

const resetIssuesCount = () => {
  issuesByMonth.length = 0;
};

const setIssuesByMonth = () => {
  resetIssuesCount();
  const tempData = getTempIssuesByMonth();
  for (var key in tempData) {
    if (tempData.hasOwnProperty(key)) {
      const year = Number(key.substr(Index.YEAR_START, Index.YEAR_END));
      const month = Number(key.substr(Index.MONTH_START, Index.MONTH_END)) - MONTH_SHIFT;
      const date = new Date(year, month);
      const issue = tempData[key];
      issuesByMonth.push({
        date,
        issue
      });
    }
  }

  issuesByMonth.sort((prev, next) => {
    return prev.date - next.date;
  });
};

const renderChart = () => {
  // сначала получаем данные
  setIssuesByMonth();
  console.log(issuesByMonth);

  /* Chart code */
  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end
  let chart = am4core.create(`chart`, am4charts.XYChart);
  chart.data = issuesByMonth;

  // Create axes
  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 60;

  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  let series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = `issue`;
  series.dataFields.dateX = `date`;
  series.tooltipText = `{issue}`;

  series.tooltip.pointerOrientation = `vertical`;

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.snapToSeries = series;
  chart.cursor.xAxis = dateAxis;

  // chart.scrollbarY = new am4core.Scrollbar();
  chart.scrollbarX = new am4core.Scrollbar();

};

filterButtonElement.addEventListener(`click`, () => {
  updateStartDate();
  updateEndDate();
  updateSystemType();
  updateCriticalityType();
  filterSources();
  setIssuesByMonth();
  renderChart();
});

const ranged = new Datepicker('.filters__filter-creation-range-date', {
  inline: true,
  ranged: true,
  time: true
});

export {renderChart};
