import Chart from 'chart.js';

const {helpers} = Chart;

const EXPANDO_COLOR = '$oldColor';
const EXPANDO_INDEX = '$selectedIndex';
const alpha = 0.1;
const globals = Chart.defaults.global || Chart.defaults;

globals.plugins.selectdata = {
  onSelection() {
  },
  onSelectionClear() {
  },
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

      // eslint-disable-next-line complexity
      chart.config.data.datasets.forEach((dataset) => {
        if (!dataset[EXPANDO_COLOR]) {
          dataset[EXPANDO_COLOR] = {};
        }
        switch (dataset.type || chart.config.type) {
        case 'line':
        case 'radar':
        case 'scatter':
          if (dataset.pointBackgroundColor === undefined) {
            dataset.pointBackgroundColor = dataset.borderColor || 'rgb(0,0,0)';
          }
          if (dataset[EXPANDO_INDEX] === selectedIndex) {
            clearSelection = true;
            dataset[EXPANDO_INDEX] = null;
            dataset.pointBackgroundColor = dataset[EXPANDO_COLOR].pointBackgroundColor;
            dataset.borderColor = dataset[EXPANDO_COLOR].borderColor;
            return;
          }

          dataset[EXPANDO_INDEX] = selectedIndex;
          if (dataset[EXPANDO_COLOR] && dataset[EXPANDO_COLOR].pointBackgroundColor) {
            dataset.pointBackgroundColor = dataset[EXPANDO_COLOR].pointBackgroundColor;
          }
          if (dataset[EXPANDO_COLOR] && dataset[EXPANDO_COLOR].borderColor) {
            dataset.borderColor = dataset[EXPANDO_COLOR].borderColor;
          }

          if (Array.isArray(dataset.pointBackgroundColor) && dataset.pointBackgroundColor.length) {
            dataset[EXPANDO_COLOR].pointBackgroundColor = dataset.pointBackgroundColor;
            dataset.pointBackgroundColor = dataset.pointBackgroundColor
              .map((color, colorIndex) => (selectedIndex !== colorIndex ? helpers.color(color).alpha(alpha).rgbString() : color));
          }
          if (typeof dataset.pointBackgroundColor === 'string') {
            dataset[EXPANDO_COLOR].pointBackgroundColor = dataset.pointBackgroundColor;
            dataset.pointBackgroundColor = dataset.data
              .map((e, colorIndex) => (selectedIndex !== colorIndex ? helpers.color(dataset.pointBackgroundColor).alpha(alpha).rgbString() : dataset.pointBackgroundColor));
          }
          if (typeof dataset.borderColor === 'string') {
            dataset[EXPANDO_COLOR].borderColor = dataset.borderColor;
            dataset.borderColor = helpers.color(dataset.borderColor).alpha(alpha).rgbString();
          }
          if (Array.isArray(dataset.borderColor) && dataset.borderColor.length) {
            dataset[EXPANDO_COLOR].borderColor = dataset.borderColor;
            dataset.borderColor = dataset.borderColor.map((color) => helpers.color(color).alpha(alpha).rgbString());
          }
          break;
        default:
          if (dataset[EXPANDO_INDEX] === selectedIndex) {
            clearSelection = true;
            dataset[EXPANDO_INDEX] = null;
            dataset.backgroundColor = dataset[EXPANDO_COLOR].backgroundColor;
            return;
          }

          dataset[EXPANDO_INDEX] = selectedIndex;
          if (dataset[EXPANDO_COLOR] && dataset[EXPANDO_COLOR].backgroundColor) {
            dataset.backgroundColor = dataset[EXPANDO_COLOR].backgroundColor;
          }
          if (Array.isArray(dataset.backgroundColor) && dataset.backgroundColor.length) {
            dataset[EXPANDO_COLOR].backgroundColor = dataset.backgroundColor;
            dataset.backgroundColor = dataset.backgroundColor
              .map((color, colorIndex) => (selectedIndex !== colorIndex ? helpers.color(color).alpha(alpha).rgbString() : color));
          }
          if (typeof dataset.backgroundColor === 'string') {
            dataset[EXPANDO_COLOR].backgroundColor = dataset.backgroundColor;
            dataset.backgroundColor = dataset.data
              .map((e, colorIndex) => (selectedIndex !== colorIndex ? helpers.color(dataset.backgroundColor).alpha(alpha).rgbString() : dataset.backgroundColor));
          }
          break;
        }
      });

      chart.update();
      const params = {
        datasetIndex: selected.map((el) => el._datasetIndex || el.datasetIndex),
        index: selectedIndex,
      };
      if (clearSelection) {
        options.onSelectionClear(params);
      } else {
        options.onSelection(params);
      }
    }
  },
};
const pluginRegister = (Chart.plugins || Chart);
pluginRegister.register(SelectionDataPlugin);

export default SelectionDataPlugin;
