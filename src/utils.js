const getValuesFromArrayObjects = (array, parametr) => {
  let valueString = ``;
  array.forEach((item) => {
    if (!valueString.includes(item[parametr])) {
      valueString += `${item[parametr]},`;
    }
  });

  const values = valueString.split(`,`);
  values.length--; // убирает лишнюю запятую
  return values;
};

const createOptions = (selectElement, values) => {
  values.forEach((item) => {
    selectElement.insertAdjacentHTML(`beforeend`, `<option value="${item}">${item}</option >`);
  });
};

export {getValuesFromArrayObjects, createOptions};
