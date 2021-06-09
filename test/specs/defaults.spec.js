import plugin from '@interisk-software/chartjs-plugin-selectdata';

describe('plugin.selectdata', function() {
  jasmine.chart.register(plugin);

  beforeEach(function() {
    this.data = {
      labels: [1, 2, 3],
      datasets: [{
        data: [1, 2, 3]
      }, {
        data: [4, 5, 6]
      }]
    };
  });

  describe('drawing', jasmine.fixture.specs('chart-bar'));

  describe('selection', function() {
    it('should emit selection event', function() {
      var onSelect = jasmine.createSpy('onSelect');
      var chart = jasmine.chart.acquire({
        type: 'bar',
        data: {
          labels: [0],
          datasets: [{
            data: [2]
          }, {
            data: [3]
          }, {
            data: [4]
          }, {
            data: [5]
          }]
        },
        options: {
          plugins: {
            selectdata: {
              onSelect
            }
          },
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
      expect(onSelect.calls.count()).toBe(0);

      jasmine.triggerMouseEvent(chart, 'click', {
        x: 76,
        y: 308
      });

      expect(onSelect.calls.count()).toBe(1);
    });
    it('should emit selection clear event', function() {
      var onSelectClear = jasmine.createSpy('onSelectClear');
      var chart = jasmine.chart.acquire({
        type: 'bar',
        data: {
          labels: [0],
          datasets: [{
            data: [2]
          }, {
            data: [3]
          }, {
            data: [4]
          }, {
            data: [5]
          }]
        },
        options: {
          plugins: {
            selectdata: {
              onSelectClear
            }
          },
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
      expect(onSelectClear.calls.count()).toBe(0);

      jasmine.triggerMouseEvent(chart, 'click', {
        x: 76,
        y: 308
      });
      expect(onSelectClear.calls.count()).toBe(0);

      jasmine.triggerMouseEvent(chart, 'click', {
        x: 76,
        y: 308
      });
      expect(onSelectClear.calls.count()).toBe(1);

    });
  });
});
