import utils from '../../src/utils';

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

describe('function', function() {
  describe('selectIndexDataSet', function() {
    it('should return false if for index different to selected', function() {
      let config = chartOptions();
      let chart = jasmine.chart.acquire(config);
      let clearSelection = utils.selectIndexDataSet(chart, 1);
      expect(clearSelection).toBeFalse();
      clearSelection = utils.selectIndexDataSet(chart, 2);
      expect(clearSelection).toBeFalse();
    });
    it('should return true if for index equal to selected ', function() {
      let config = chartOptions();
      let chart = jasmine.chart.acquire(config);
      let clearSelection = utils.selectIndexDataSet(chart, 1);
      expect(clearSelection).toBeFalse();
      clearSelection = utils.selectIndexDataSet(chart, 1);
      expect(clearSelection).toBeTrue();
    });
  });
  describe('emitEventSelection', function() {
    it('should return false if for index different to selected', function() {
      const config = chartOptions();
      const onSelect = jasmine.createSpy('onSelect');
      const chart = jasmine.chart.acquire(config);
      utils.emitEventSelection(0, [{datasetIndex: 0}], false, {onSelect}, chart);
      expect(onSelect.calls.count()).toBe(1);
    });
    it('should return false if for index different to selected', function() {
      const config = chartOptions();
      const onSelectClear = jasmine.createSpy('onSelect');
      const chart = jasmine.chart.acquire(config);
      const index = Math.floor(Math.random() * 10);
      const datasetIndex = Math.floor(Math.random() * 10);

      utils.emitEventSelection(index, [{datasetIndex}], true, {onSelectClear}, chart);

      expect(onSelectClear.calls.count()).toBe(1);
      expect(onSelectClear.calls.argsFor(0)[0].index).toBe(index);
      expect(onSelectClear.calls.argsFor(0)[0].datasetIndex[0]).toBe(datasetIndex);
      expect(onSelectClear.calls.argsFor(0)[1]).toBe(chart);

    });
  });
});
