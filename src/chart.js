import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { getDefectsByMonth } from "./filters.js";

const renderChart = () => {
  /* Chart code */
  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end
  let chart = am4core.create(`chart`, am4charts.XYChart);
  chart.data = getDefectsByMonth();

  // Create axes
  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 60;

  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  let series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = `defectsCount`;
  series.dataFields.dateX = `date`;
  series.tooltipText = `{defectsCount}`;

  series.tooltip.pointerOrientation = `vertical`;

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.snapToSeries = series;
  chart.cursor.xAxis = dateAxis;

  // chart.scrollbarY = new am4core.Scrollbar();
  chart.scrollbarX = new am4core.Scrollbar();
};

export { renderChart };
