import plugin from '@interisk-software/chartjs-plugin-selectdata';

describe('drawing', function() {
  jasmine.chart.register(plugin);
  describe('auto', jasmine.fixture.specs('chart-bar'));
});
