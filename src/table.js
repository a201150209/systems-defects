import {sources} from './sources.js';

const renderTable = () => {
  var Tabulator = require('tabulator-tables');
  var table = new Tabulator('#source-table', {
    height: '311px',
    layout: 'fitColumns',
    data: sources,
    columns: [
      {title: 'ID', field: 'ID', headerFilter: 'input'},
      {title: 'System', field: 'System', headerFilter: 'input'},
      {title: 'Summary', field: 'Summary', headerFilter: 'input'},
      {title: 'Состояние', field: 'Состояние', headerFilter: 'input'},
      {title: 'Найдено при', field: 'Найдено при', headerFilter: 'input'},
      {title: 'Критичность', field: 'Критичность', headerFilter: 'input'},
      {title: 'Тип Дефекта', field: 'Тип Дефекта', headerFilter: 'input'},
      {title: 'Дата создания', field: 'Дата создания', headerFilter: 'input'},
      {title: 'Дата изменения', field: 'Дата изменения', headerFilter: 'input'},
      {title: 'Дата закрытия', field: 'Дата закрытия', headerFilter: 'input'},
      {title: 'Метод обнаружения', field: 'Метод обнаружения', headerFilter: 'input'},
      {title: 'reopens_amount', field: 'reopens_amount', headerFilter: 'input'},
    ],
  });
};

export {renderTable};
