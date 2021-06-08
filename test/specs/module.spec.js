import Chart from 'chart.js';
import plugin from '@interisk-software/chartjs-plugin-selectdata';

describe('module', function() {
  it ('should be globally exported in SelectionDataPlugin', function() {
    expect(typeof window.SelectionDataPlugin).toBe('object');
    expect(window.SelectionDataPlugin).toBe(plugin);
  });

  it ('should be referenced with id "selectdata"', function() {
    expect(plugin.id).toBe('selectdata');
  });

  it ('should not be globally registered', function() {
    var plugins = Chart.plugins.getAll();
    expect(plugins.find((p) => p.id === 'selectdata')).toBeUndefined();
    expect(!plugins.includes(plugin));
  });
});
