import Chart from 'chart.js';
import {ALPHA, EXPANDO_COLOR, EXPANDO_INDEX, EXPANDO_INDEX_DATASET} from './constants';

const {helpers} = Chart;

const ifNeedClearSelection = function(dataset, selectedIndex, selectedIndexDataSet, resetKeys) {
  if (dataset[EXPANDO_INDEX] === selectedIndex && dataset[EXPANDO_INDEX_DATASET] === selectedIndexDataSet) {
    dataset[EXPANDO_INDEX] = null;
    dataset[EXPANDO_INDEX_DATASET] = null;
    resetKeys.forEach(key => {
      dataset[key] = dataset[EXPANDO_COLOR][key];
    });
    return true;
  }

  dataset[EXPANDO_INDEX] = selectedIndex;
  dataset[EXPANDO_INDEX_DATASET] = selectedIndexDataSet;
  return false;
};

const checkExpandoKeys = function(dataset, checkKeys) {
  checkKeys.forEach(key => {
    if (dataset[EXPANDO_COLOR] && dataset[EXPANDO_COLOR][key] !== undefined) {
      dataset[key] = dataset[EXPANDO_COLOR][key];
    }
  });
};

const setColorsAlphaNotSelected = function(dataset, selectedIndex, key) {
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

const setColorsAlphaAll = function(dataset, key) {
  if (typeof dataset[key] === 'string') {
    dataset[EXPANDO_COLOR][key] = dataset[key];
    dataset[key] = helpers.color(dataset[key]).alpha(ALPHA).rgbString();
  }
  if (Array.isArray(dataset[key]) && dataset[key].length) {
    dataset[EXPANDO_COLOR][key] = dataset[key];
    dataset[key] = dataset[key].map((color) => helpers.color(color).alpha(ALPHA).rgbString());
  }
};

const selectIndexDataSet = function(chart, selectedIndex, selectedIndexDataSet) {
  chart.selectedIndex = selectedIndex;
  chart.selectIndexDataSet = selectedIndexDataSet;
  let clearSelection = false;
  const indexIsEqual = (index, anotherIndex, trust, fake) => index === anotherIndex ? trust() : fake();
  chart.config.data.datasets.forEach((dataset, indexDataSet) => {
    if (!dataset[EXPANDO_COLOR]) {
      dataset[EXPANDO_COLOR] = {};
    }
    dataset._integrity = true;
    switch (dataset.type || chart.config.type) {
    case 'line':
    case 'radar':
    case 'scatter':
      dataset.pointBackgroundColor = dataset.pointBackgroundColor === undefined ? dataset.borderColor || 'rgb(0,0,0)' : dataset.pointBackgroundColor;
      if (ifNeedClearSelection(dataset, selectedIndex, selectedIndexDataSet, ['pointBackgroundColor', 'borderColor'])) {
        clearSelection = true;
        return;
      }
      checkExpandoKeys(dataset, ['pointBackgroundColor', 'borderColor']);

      indexIsEqual(
        indexDataSet, selectedIndexDataSet,
        () => setColorsAlphaNotSelected(dataset, selectedIndex, 'pointBackgroundColor'),
        ()=> setColorsAlphaAll(dataset, 'pointBackgroundColor')
      );

      setColorsAlphaAll(dataset, 'borderColor');
      break;
    default:
      if (ifNeedClearSelection(dataset, selectedIndex, selectedIndexDataSet, ['backgroundColor'])) {
        clearSelection = true;
        return;
      }
      checkExpandoKeys(dataset, ['backgroundColor']);

      indexIsEqual(
        indexDataSet, selectedIndexDataSet,
        () => setColorsAlphaNotSelected(dataset, selectedIndex, 'backgroundColor'),
        ()=> setColorsAlphaAll(dataset, 'backgroundColor')
      );
      break;
    }
  });

  chart.update();
  return clearSelection;
};

const emitEventSelection = function(selectedIndex, selectedIndexDataSet, clearSelection, options, chart) {
  const params = {
    datasetIndex: selectedIndexDataSet,
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
  ifNeedClearSelection,
  checkExpandoKeys,
  setColorsAlphaNotSelected,
  setColorsAlphaAll,
  selectIndexDataSet,
  emitEventSelection
};
export default utils;
