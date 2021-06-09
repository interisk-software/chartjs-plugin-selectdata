import Chart from 'chart.js';
import utils from './utils';
import {EXPANDO_COLOR, EXPANDO_INDEX} from './constants';

const globals = Chart.defaults.global || Chart.defaults;

globals.plugins.selectdata = {
  onSelect: undefined,
  onSelectClear: undefined
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
      utils.selectIndexDataSet(chart, index);
      chart.update();
    };
  },
  afterEvent(chart, chartEvent, options) {
    if (!options) {
      return;
    }
    const eventType = chartEvent.type || chartEvent.event.type;
    if (eventType === 'click') {

      let selectedElements = [];

      if (chart.getElementsAtEvent) {
        selectedElements = chart.getElementsAtEvent(chartEvent);
      } else {
        selectedElements = chart.getElementsAtEventForMode(chartEvent.event.native, 'index', {intersect: true}, false);
      }

      if (!selectedElements || (Array.isArray(selectedElements) && !selectedElements.length)) {
        return;
      }

      const selectedIndex = selectedElements[0]._index === undefined ? selectedElements[0].index : selectedElements[0]._index;
      let clearSelection = utils.selectIndexDataSet(chart, selectedIndex);
      utils.emitEventSelection(selectedIndex, selectedElements, clearSelection, options, chart);
    }
  },
};

window.SelectionDataPlugin = SelectionDataPlugin;

export default SelectionDataPlugin;
