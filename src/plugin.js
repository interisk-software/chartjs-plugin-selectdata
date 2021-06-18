import Chart from 'chart.js';
import utils from './utils';
import {EXPANDO_COLOR, EXPANDO_INDEX, EXPANDO_INDEX_DATASET} from './constants';

const globals = Chart.defaults.global || Chart.defaults;

globals.plugins.selectdata = {
  onSelect: undefined,
  onSelectClear: undefined
};
const SelectionDataPlugin = {
  id: 'selectdata',
  beforeUpdate(chart) {
    if (chart.data.datasets.find(el => !el._integrity) && chart.selectedIndex !== undefined && chart.selectIndexDataSet !== undefined) {
      utils.selectIndexDataSet(chart, chart.selectedIndex, chart.selectIndexDataSet);
    }
  },
  afterInit(chart) {
    chart.clearSelection = function() {
      chart.config.data.datasets.forEach((dataset) => {
        dataset[EXPANDO_INDEX] = null;
        dataset[EXPANDO_INDEX_DATASET] = null;
        Object.keys(dataset).forEach(key => {
          if (dataset[EXPANDO_COLOR] && dataset[EXPANDO_COLOR][key] !== undefined) {
            dataset[key] = dataset[EXPANDO_COLOR][key];
          }
        });
      });
      chart.update();
    };
    chart.selectDataIndex = function(index, indexDataSet = 0) {
      utils.selectIndexDataSet(chart, index, indexDataSet);
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
      if (chart.getElementAtEvent) {
        selectedElements = chart.getElementAtEvent(chartEvent);
      } else {
        selectedElements = chart.getElementsAtEventForMode(chartEvent.event.native, 'nearest', {intersect: true}, false);
      }

      if (!selectedElements || (Array.isArray(selectedElements) && !selectedElements.length)) {
        return;
      }
      const selectedIndex = selectedElements[0]._index === undefined ? selectedElements[0].index : selectedElements[0]._index;
      const selectIndexDataSet = selectedElements[0]._datasetIndex === undefined ? selectedElements[0].datasetIndex : selectedElements[0]._datasetIndex;
      let clearSelection = utils.selectIndexDataSet(chart, selectedIndex, selectIndexDataSet);
      utils.emitEventSelection(selectedIndex, selectIndexDataSet, clearSelection, options, chart);
    }
  },
};

window.SelectionDataPlugin = SelectionDataPlugin;

export default SelectionDataPlugin;
