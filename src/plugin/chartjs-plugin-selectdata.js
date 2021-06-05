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

const SelectionDataPlugin = {
  id: 'selectdata',
  afterEvent(chart, chartEvent, options) {
    const eventType = chartEvent.type || chartEvent.event.type;
    if (eventType === 'click') {
      let selected = [];

      if (chart.getElementsAtEvent) {
        selected = chart.getElementsAtEvent(chartEvent);
      } else {
        selected = chart.getElementsAtEventForMode(chartEvent.event.native, 'index', {intersect: true}, false);
      }

      if (selected && !selected.length) {
        return;
      }
      const selectedIndex = selected[0]._index || selected[0].index;
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
          if (dataset[EXPANDO_COLOR] && dataset[EXPANDO_COLOR][key]) {
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
            .map((e, colorIndex) => (selectedIndex !== colorIndex ? helpers.color(dataset[key]).alpha(alpha).rgbString() : dataset.pointBackgroundColor));
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
      const params = {
        datasetIndex: selected.map((el) => el._datasetIndex || el.datasetIndex),
        index: selectedIndex,
      };
      if (clearSelection && options.onSelectionClear) {
        options.onSelectionClear(params);
      } else if (options.onSelection) {
        options.onSelection(params);
      }
    }
  },
};
const pluginRegister = (Chart.plugins || Chart);
pluginRegister.register(SelectionDataPlugin);

export default SelectionDataPlugin;
