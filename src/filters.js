import { sources } from "./sources.js";
import { renderChart } from "./chart.js";
import { getValuesFromArrayObjects, createOptions } from "./utils.js";

const CREATING_DATE_NAME = `Дата создания`;
const SYSTEM_TYPE_NAME = `System`;
const CRITICALITY_TYPE_NAME = `Критичность`;
const SYSTEM_TYPE_ID = `system-type-filter`;
const CRITICALITY_TYPE_ID = `criticality-type-filter`;
const BUTTON_ID = `filter-button`;
const DATE_ID = `date-filter`;
const START_DEFECTS_COUNT = 1;
const Index = {
  YEAR_START: 0,
  MONTH_END: 7,
};

const datepickerElement = new Datepicker(`#${DATE_ID}`, {
  inline: true,
  ranged: true,
  time: true,
});

const systemTypeFilterElement = document.body.querySelector(
  `#${SYSTEM_TYPE_ID}`
);
const criticalityTypeFilterElement = document.body.querySelector(
  `#${CRITICALITY_TYPE_ID}`
);
const filterButtonElement = document.body.querySelector(`#${BUTTON_ID}`);

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

const setFilterSelects = () => {
  const systemTypes = getValuesFromArrayObjects(sources, SYSTEM_TYPE_NAME);
  const criticalityTypes = getValuesFromArrayObjects(
    sources,
    CRITICALITY_TYPE_NAME
  );
  createOptions(systemTypeFilterElement, systemTypes);
  createOptions(criticalityTypeFilterElement, criticalityTypes);
};

const updateDates = () => {
  const selectedDates = datepickerElement.getDate();
  const [startDate] = selectedDates;
  const endDate = selectedDates[selectedDates.length - 1];

  if (startDate) {
    filterStatus.startDate.value = startDate;
    filterStatus.startDate.isActive = true;
  } else {
    filterStatus.startDate.isActive = false;
  }

  if (endDate) {
    filterStatus.endDate.value = endDate;
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
  return sources.filter((item) => {
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
      isCriticalityType =
        item[CRITICALITY_TYPE_NAME] === filterStatus.criticalityType.value;
    }

    return isStartDate && isEndDate && isSystemType && isCriticalityType;
  });
};

const getDefectsByMonth = () => {
  const filteredSources = filterSources();
  const defectsByMonth = filteredSources.reduce((sum, item) => {
    const monthAndYear = new Date(
      item[CREATING_DATE_NAME].substr(Index.YEAR_START, Index.MONTH_END)
    );
    const monthAndYearInResult = sum.find((it) => {
      return Number(it.date) === Number(monthAndYear);
      //Оказывается, что даже если два объекта даты полностью одинаковы, то сравнить их так нельзя - это два разных объекта, а то, что в них находится одинаковая дата не имеет значения
    });

    if (monthAndYearInResult) {
      monthAndYearInResult.defectsCount++;
    } else {
      sum.push({
        date: monthAndYear,
        defectsCount: START_DEFECTS_COUNT,
      });
    }
    return sum;
  }, []);

  defectsByMonth.sort((prev, next) => {
    return prev.date - next.date;
  });

  return defectsByMonth;
};

filterButtonElement.addEventListener(`click`, () => {
  updateDates();
  updateSystemType();
  updateCriticalityType();
  renderChart();
});

setFilterSelects();

export { getDefectsByMonth };
