import utils from '../../src/utils';
import {ALPHA, EXPANDO_COLOR, EXPANDO_INDEX, EXPANDO_INDEX_DATASET} from '../../src/constants';
import Chart from 'chart.js';
const {helpers} = Chart;

describe('utils', function() {

  const chartOptions = () => ({
    type: 'bar',
    data: {
      labels: [2, 3, 4, 5],
      datasets: [{
        backgroundColor: '#444',
        data: [2, 3, 4, 5]
      }]
    },

    options: {
      elements: {
        rectangle: {
          backgroundColor: '#444',
        }
      },
      layout: {
        padding: 20
      }
    }
  });
  const color = '#3c5399';
  const colorArray = [color, color, color];
  const key = 'key';
  const dataset = {};
  const selectedIndex = Math.floor(Math.random() * 2);
  const selectedIndexDataSet = Math.floor(Math.random() * 2);
  dataset.data = [1, 2, 3];
  dataset[EXPANDO_COLOR] = {};

  describe('ifNeedClearSelection', function() {
    it('should return true for equal index', function() {
      dataset[key] = 'fake';
      dataset[EXPANDO_COLOR][key] = 'trust';
      dataset[EXPANDO_INDEX] = selectedIndex;
      dataset[EXPANDO_INDEX_DATASET] = selectedIndexDataSet;
      const result = utils.ifNeedClearSelection(dataset, selectedIndex, selectedIndexDataSet, [key]);
      expect(result).toBeTrue();
      expect(dataset[key]).toEqual(dataset[EXPANDO_COLOR][key]);
    });
    it('should return false for different index', function() {
      dataset[key] = 'fake';
      dataset[EXPANDO_COLOR][key] = 'trust';
      dataset[EXPANDO_INDEX] = selectedIndex;
      const newIndex = selectedIndex + 2;
      const result = utils.ifNeedClearSelection(dataset, newIndex, [key]);
      expect(result).toBeFalse();
      expect(dataset[EXPANDO_INDEX]).toEqual(newIndex);
    });
  });
  describe('checkExpandoKeys', function() {
    it('should set the value to the same value as `EXPANDO_COLOR` in `keyTest`', function() {
      const keyTest = 'test';
      dataset[EXPANDO_COLOR][keyTest] = keyTest;

      expect(dataset[keyTest]).toBeUndefined();
      utils.checkExpandoKeys(dataset, [keyTest]);
      expect(dataset[keyTest]).toEqual(keyTest);
    });
  });
  describe('setColorsAlphaNotSelected', function() {
    it('should set color by string', function() {
      dataset[key] = color;
      utils.setColorsAlphaNotSelected(dataset, selectedIndex, key);
      expect(dataset[EXPANDO_COLOR][key]).toEqual(color);
      expect(dataset[key][selectedIndex]).toEqual(color);
      expect(dataset[key].filter(c => c !== color).length).toEqual(colorArray.length - 1);
    });
    it('should set color by array', function() {
      dataset[key] = colorArray;
      utils.setColorsAlphaNotSelected(dataset, selectedIndex, key);
      expect(dataset[EXPANDO_COLOR][key]).toEqual(colorArray);
      expect(dataset[key][selectedIndex]).toEqual(color);
      expect(dataset[key].filter(c => c !== color).length).toEqual(colorArray.length - 1);
    });
  });
  describe('setColorsAlphaAll', function() {
    it('should set color by string', function() {
      dataset[key] = color;
      utils.setColorsAlphaAll(dataset, key);
      expect(dataset[EXPANDO_COLOR][key]).toEqual(color);
      expect(dataset[key]).toEqual(helpers.color(dataset[key]).alpha(ALPHA).rgbString());
    });
    it('should set color by array', function() {
      dataset[key] = colorArray;
      utils.setColorsAlphaAll(dataset, key);
      const result = dataset[key].every(
        c => c === helpers.color(color).alpha(ALPHA).rgbString()
      );
      expect(dataset[EXPANDO_COLOR][key]).toEqual(colorArray);
      expect(result).toBeTrue();
      expect(dataset[key].filter(c => c !== color).length).toEqual(colorArray.length);
    });
  });
  describe('selectIndexDataSet', function() {
    describe('barChart', function() {
      it('should return false if for index different to selected', function() {
        let config = chartOptions();
        let chart = jasmine.chart.acquire(config);
        let clearSelection = utils.selectIndexDataSet(chart, 1, 0);
        expect(clearSelection).toBeFalse();
        clearSelection = utils.selectIndexDataSet(chart, 2, 1);
        expect(clearSelection).toBeFalse();
        clearSelection = utils.selectIndexDataSet(chart, 1, 0);
        expect(clearSelection).toBeFalse();
      });
      it('should return true if for index equal to selected ', function() {
        let config = chartOptions();
        let chart = jasmine.chart.acquire(config);
        let clearSelection = utils.selectIndexDataSet(chart, 1, 0);
        expect(clearSelection).toBeFalse();
        clearSelection = utils.selectIndexDataSet(chart, 2, 0);
        expect(clearSelection).toBeFalse();
        clearSelection = utils.selectIndexDataSet(chart, 2, 0);
        expect(clearSelection).toBeTrue();
      });
    });
    describe('lineChart', function() {
      it('should return false if for index different to selected', function() {
        let config = chartOptions();
        config.type = 'line';
        let chart = jasmine.chart.acquire(config);
        let clearSelection = utils.selectIndexDataSet(chart, 1, 0);
        expect(clearSelection).toBeFalse();
        clearSelection = utils.selectIndexDataSet(chart, 2, 1);
        expect(clearSelection).toBeFalse();
        clearSelection = utils.selectIndexDataSet(chart, 1, 0);
        expect(clearSelection).toBeFalse();
      });
      it('should return true if for index equal to selected ', function() {
        let config = chartOptions();
        config.type = 'line';
        let chart = jasmine.chart.acquire(config);
        let clearSelection = utils.selectIndexDataSet(chart, 1, 0);
        expect(clearSelection).toBeFalse();
        clearSelection = utils.selectIndexDataSet(chart, 2, 0);
        expect(clearSelection).toBeFalse();
        clearSelection = utils.selectIndexDataSet(chart, 2, 0);
        expect(clearSelection).toBeTrue();
      });
    });
  });
  describe('emitEventSelection', function() {
    it('should return false if for index different to selected', function() {
      const config = chartOptions();
      const onSelect = jasmine.createSpy('onSelect');
      const chart = jasmine.chart.acquire(config);
      utils.emitEventSelection(0, 0, false, {onSelect}, chart);
      expect(onSelect.calls.count()).toBe(1);
    });
    it('should return false if for index different to selected', function() {
      const config = chartOptions();
      const onSelectClear = jasmine.createSpy('onSelect');
      const chart = jasmine.chart.acquire(config);
      const index = Math.floor(Math.random() * 10);
      const datasetIndex = Math.floor(Math.random() * 10);

      utils.emitEventSelection(index, datasetIndex, true, {onSelectClear}, chart);

      expect(onSelectClear.calls.count()).toBe(1);
      expect(onSelectClear.calls.argsFor(0)[0].index).toBe(index);
      expect(onSelectClear.calls.argsFor(0)[0].datasetIndex).toBe(datasetIndex);
      expect(onSelectClear.calls.argsFor(0)[1]).toBe(chart);

    });
  });
});
