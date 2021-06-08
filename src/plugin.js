import Chart from 'chart.js';

const {helpers} = Chart;

const EXPANDO_COLOR = '$oldColor';
const EXPANDO_INDEX = '$selectedIndex';
const alpha = 0.1;
const globals = Chart.defaults.global || Chart.defaults;

globals.plugins.selectdata = {
  onSelection: undefined,
  onSelectionClear: undefined
};

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
        .map((color, colorIndex) => (selectedIndex !== colorIndex ? helpers.color(color).alpha(alpha).rgbString() : color));
    }
    if (typeof dataset[key] === 'string') {
      dataset[EXPANDO_COLOR][key] = dataset[key];
      dataset[key] = dataset.data
        .map((e, colorIndex) => (selectedIndex !== colorIndex ? helpers.color(dataset[key]).alpha(alpha).rgbString() : dataset[key]));
    }
  };
  const setColorsAlphaAll = (dataset, key) => {
    if (typeof dataset[key] === 'string') {
      dataset[EXPANDO_COLOR][key] = dataset[key];
      dataset[key] = helpers.color(dataset[key]).alpha(alpha).rgbString();
    }
    if (Array.isArray(dataset[key]) && dataset[key].length) {
      dataset[EXPANDO_COLOR][key] = dataset[key];
      dataset[key] = dataset[key].map((color) => helpers.color(color).alpha(alpha).rgbString());
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

const emitEventSelection = function(selectedIndex, selected, clearSelection, options) {
  const params = {
    datasetIndex: selected.map((el) => el._datasetIndex || el.datasetIndex),
    index: selectedIndex,
  };
  if (clearSelection && options.onSelectionClear) {
    options.onSelectionClear(params);
  } else if (options.onSelection) {
    options.onSelection(params);
  }
};

const SelectionDataPlugin = {
  id: 'selectdata',
  afterInit(chart) {
    chart.clearSelection = function() {
      chart.config.data.datasets.forEach((dataset) => {
        dataset[EXPANDO_INDEX] = null;
        Object.keys(dataset).forEach(key => {
          if (dataset[EXPANDO_COLOR] && dataset[EXPANDO_COLOR][key] !== undefined) {
            dataset[key] = dataset[EXPANDO_COLOR][key];
          }
        });
      });
      chart.update();
    };
    chart.selectDataIndex = function(index) {
      selectIndexDataSet(chart, index);
      chart.update();
    };
  },
  afterEvent(chart, chartEvent, options) {
    const eventType = chartEvent.type || chartEvent.event.type;
    if (eventType === 'click') {

      let selectedElements = [];

      if (chart.getElementsAtEvent) {
        selectedElements = chart.getElementsAtEvent(chartEvent);
      } else {
        selectedElements = chart.getElementsAtEventForMode(chartEvent.event.native, 'index', {intersect: true}, false);
      }

      if (selectedElements && !selectedElements.length) {
        return;
      }
      const selectedIndex = selectedElements[0]._index === undefined ? selectedElements[0].index : selectedElements[0]._index;
      let clearSelection = selectIndexDataSet(chart, selectedIndex, options);
      emitEventSelection(selectedIndex, selectedElements, clearSelection, options);
    }
  },
};
// const pluginRegister = (Chart.plugins || Chart);
// pluginRegister.register(SelectionDataPlugin);
window.SelectionDataPlugin = SelectionDataPlugin;
export default SelectionDataPlugin;
