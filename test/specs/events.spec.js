import plugin from '@interisk-software/chartjs-plugin-selectdata';

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
describe('events', function() {
  jasmine.chart.register(plugin);

  describe('selection click', function() {
    it('should emit selection event', function() {
      const onSelect = jasmine.createSpy('onSelect');
      const config = chartOptions();
      config.options.plugins = {
        selectdata: {
          onSelect: onSelect
        }
      };
      const chart = jasmine.chart.acquire(config);

      expect(onSelect.calls.count()).toBe(0);

      jasmine.triggerMouseEvent(chart, 'click', {
        x: 76,
        y: 308
      });

      expect(onSelect.calls.count()).toBe(1);
    });
    it('should change color when selecting', function() {
      const config = chartOptions();
      const chart = jasmine.chart.acquire(config);

      jasmine.triggerMouseEvent(chart, 'click', {
        x: 76,
        y: 308
      });

      const colors = chart.config.data.datasets[0].backgroundColor;
      expect(colors.length).toEqual(4);
      expect(colors[0]).toEqual('#444');
      expect(colors.filter(color => color === 'rgba(68, 68, 68, 0.1)').length).toEqual(3);
    });
    it('should emit selection clear event', function() {
      const onSelectClear = jasmine.createSpy('onSelectClear');
      const config = chartOptions();
      config.options.plugins = {
        selectdata: {
          onSelectClear
        }
      };
      const chart = jasmine.chart.acquire(config);

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
    it('should change color when clear selection', function() {
      const config = chartOptions();
      const chart = jasmine.chart.acquire(config);

      jasmine.triggerMouseEvent(chart, 'click', {
        x: 76,
        y: 308
      });
      let colors = chart.config.data.datasets[0].backgroundColor;
      expect(colors.length).toEqual(4);
      expect(colors[0]).toEqual('#444');
      expect(colors.filter(color => color === 'rgba(68, 68, 68, 0.1)').length).toEqual(3);
      jasmine.triggerMouseEvent(chart, 'click', {
        x: 76,
        y: 308
      });
      colors = chart.config.data.datasets[0].backgroundColor;
      expect(colors).toEqual('#444');
    });
  });

  describe('selection programmatically', function() {
    it('should emit selection event', function() {
      const config = chartOptions();
      const chart = jasmine.chart.acquire(config);

      chart.selectDataIndex(0);

      const colors = chart.config.data.datasets[0].backgroundColor;

      expect(colors.length).toEqual(4);
      expect(colors[0]).toEqual('#444');
      expect(colors.filter(color => color === 'rgba(68, 68, 68, 0.1)').length).toEqual(3);
    });
    it('should change color when selecting', function() {
      const config = chartOptions();
      const chart = jasmine.chart.acquire(config);

      chart.selectDataIndex(0);

      const colors = chart.config.data.datasets[0].backgroundColor;
      expect(colors.length).toEqual(4);
      expect(colors[0]).toEqual('#444');
      expect(colors.filter(color => color === 'rgba(68, 68, 68, 0.1)').length).toEqual(3);
    });
    it('should emit selection clear event', function() {
      const config = chartOptions();
      const chart = jasmine.chart.acquire(config);

      chart.selectDataIndex(0);

      let colors = chart.config.data.datasets[0].backgroundColor;

      expect(colors.length).toEqual(4);
      expect(colors[0]).toEqual('#444');
      expect(colors.filter(color => color === 'rgba(68, 68, 68, 0.1)').length).toEqual(3);

      chart.clearSelection();

      colors = chart.config.data.datasets[0].backgroundColor;

      expect(colors).toEqual('#444');

    });
    it('should change color when clear selection', function() {
      const config = chartOptions();
      const chart = jasmine.chart.acquire(config);

      chart.selectDataIndex(0);

      let colors = chart.config.data.datasets[0].backgroundColor;
      expect(colors.length).toEqual(4);
      expect(colors[0]).toEqual('#444');
      expect(colors.filter(color => color === 'rgba(68, 68, 68, 0.1)').length).toEqual(3);
      chart.clearSelection(0);
      colors = chart.config.data.datasets[0].backgroundColor;
      expect(colors).toEqual('#444');
    });
  });
});
