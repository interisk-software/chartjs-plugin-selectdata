import plugin from '@interisk-software/chartjs-plugin-selectdata';
import Chart from 'chart.js';

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

describe('plugin', function() {
  jasmine.chart.register(plugin);
  it('should disable plugin', function() {
    const onSelect = jasmine.createSpy('onSelect');
    const onSelectClear = jasmine.createSpy('onSelectClear');
    Chart.defaults.global.plugins.selectdata = {
      onSelect,
      onSelectClear
    };
    const config = chartOptions();
    config.options.plugins = false;
    const chart = jasmine.chart.acquire(config);

    jasmine.triggerMouseEvent(chart, 'click', {
      x: 76,
      y: 308
    });
    jasmine.triggerMouseEvent(chart, 'click', {
      x: 76,
      y: 308
    });

    expect(onSelect.calls.count()).toBe(0);
    expect(onSelectClear.calls.count()).toBe(0);
  });
  it('should disable plugin if not found option', function() {
    const getElementsAtEvent = jasmine.createSpy('getElementsAtEvent');
    getElementsAtEvent.and.returnValue([{_index: 0}]);

    const config = chartOptions();
    config.options.plugins = false;
    const chart = jasmine.chart.acquire(config);
    chart.getElementsAtEvent = getElementsAtEvent;

    plugin.afterEvent(chart, {type: 'click'}, null);
    expect(getElementsAtEvent.calls.count()).toBe(0);
  });
  it('should disable plugin if not found selectedElements', function() {
    const mockChart = jasmine.createSpyObj('chart', ['getElementsAtEventForMode']);
    mockChart.getElementsAtEventForMode.and.returnValue([]);
    plugin.afterEvent(mockChart, {type: 'click', event: {native: null}}, {});
    expect(mockChart.getElementsAtEventForMode.calls.count()).toBe(1);
  });
});
