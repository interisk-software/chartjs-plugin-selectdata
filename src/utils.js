import Chart from 'chart.js';
import {ALPHA, EXPANDO_COLOR, EXPANDO_INDEX} from './constants';

const {helpers} = Chart;

const selectIndexDataSet = function(chart, selectedIndex) {
  let clearSelection = false;
  const ifNeedClearSelection = (dataset, resetKeys = []) => {
    if (dataset[EXPANDO_INDEX] === selectedIndex) {
      clearSelection = true;
      dataset[EXPANDO_INDEX] = null;
      resetKeys.forEach(key => {
        dataset[key] = dataset[EXPANDO_COLOR][key];
      });
      return true;
    }

    dataset[EXPANDO_INDEX] = selectedIndex;
    return false;
  };

  const checkExpandoKeys = (dataset, checkKeys = []) => {
    checkKeys.forEach(key => {
      if (dataset[EXPANDO_COLOR] && dataset[EXPANDO_COLOR][key] !== undefined) {
        dataset[key] = dataset[EXPANDO_COLOR][key];
      }
    });
  };

  const setColorsAlphaNotSelected = (dataset, key) => {
    if (Array.isArray(dataset[key]) && dataset[key].length) {
      dataset[EXPANDO_COLOR][key] = dataset[key];
      dataset[key] = dataset[key]
        .map((color, colorIndex) => (selectedIndex !== colorIndex ? helpers.color(color).alpha(ALPHA).rgbString() : color));
    }
    if (typeof dataset[key] === 'string') {
      dataset[EXPANDO_COLOR][key] = dataset[key];
      dataset[key] = dataset.data
        .map((e, colorIndex) => (selectedIndex !== colorIndex ? helpers.color(dataset[key]).alpha(ALPHA).rgbString() : dataset[key]));
    }
  };
  const setColorsAlphaAll = (dataset, key) => {
    if (typeof dataset[key] === 'string') {
      dataset[EXPANDO_COLOR][key] = dataset[key];
      dataset[key] = helpers.color(dataset[key]).alpha(ALPHA).rgbString();
    }
    if (Array.isArray(dataset[key]) && dataset[key].length) {
      dataset[EXPANDO_COLOR][key] = dataset[key];
      dataset[key] = dataset[key].map((color) => helpers.color(color).alpha(ALPHA).rgbString());
    }
  };

  chart.config.data.datasets.forEach((dataset) => {
    if (!dataset[EXPANDO_COLOR]) {
      dataset[EXPANDO_COLOR] = {};
    }
    switch (dataset.type || chart.config.type) {
    case 'line':
    case 'radar':
    case 'scatter':
      dataset.pointBackgroundColor = dataset.pointBackgroundColor === undefined ? dataset.borderColor || 'rgb(0,0,0)' : dataset.pointBackgroundColor;
      if (ifNeedClearSelection(dataset, ['pointBackgroundColor', 'borderColor'])) {
        return;
      }
      checkExpandoKeys(dataset, ['pointBackgroundColor', 'borderColor']);
      setColorsAlphaNotSelected(dataset, 'pointBackgroundColor');
      setColorsAlphaAll(dataset, 'borderColor');
      break;
    default:
      if (ifNeedClearSelection(dataset, ['backgroundColor'])) {
        return;
      }
      checkExpandoKeys(dataset, ['backgroundColor']);
      setColorsAlphaNotSelected(dataset, 'backgroundColor');
      break;
    }
  });

  chart.update();
  return clearSelection;
};
const emitEventSelection = function(selectedIndex, selected, clearSelection, options, chart) {
  const params = {
    datasetIndex: selected.map((el) => el._datasetIndex === undefined ? el.datasetIndex : el._datasetIndex),
    index: selectedIndex,
  };
  if (clearSelection && options.onSelectClear) {
    options.onSelectClear(params, chart);
  }
  if (!clearSelection && options.onSelect) {
    options.onSelect(params, chart);
  }
};

const utils = {
  emitEventSelection,
  selectIndexDataSet
};
export default utils;
