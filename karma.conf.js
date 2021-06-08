const commonjs = require('rollup-plugin-commonjs');
const istanbul = require('rollup-plugin-istanbul');
const resolve = require('rollup-plugin-node-resolve');
const builds = require('./rollup.config');
const yargs = require('yargs');

module.exports = function(karma) {
  const args = yargs.argv;
  const regex = args.autoWatch ? /\.js$/ : /\.min\.js$/;
  const pattern = !args.grep || args.grep === true ? '' : args.grep;
  const specs = `test/specs/**/*${pattern}*spec.js`;
  const output = builds[0].output.filter((v) => v.file.match(regex))[0];
  const build = Object.assign({}, builds[0], {output: output});

  if (args.autoWatch) {
    build.output.sourcemap = 'inline';
  }

  karma.set({
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    reporters: ['spec', 'kjhtml'],
    logLevel: karma.LOG_WARN,

    files: [
      {pattern: './test/fixtures/**/*.js', included: false},
      {pattern: './test/fixtures/**/*.png', included: false},
      'node_modules/chart.js/dist/Chart.js',
      'test/index.js',
      'src/plugin.js',
      specs
    ],

    customLaunchers: {
      // eslint-disable-next-line camelcase
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--headless', '--disable-web-security', '--disable-site-isolation-trials']
      }
    },

    preprocessors: {
      'test/fixtures/**/*.js': ['fixtures'],
      'test/specs/**/*.js': ['rollup'],
      'test/index.js': ['rollup'],
      'src/plugin.js': ['sources']
    },

    rollupPreprocessor: {
      plugins: [
        resolve(),
        commonjs()
      ],
      external: [
        'chart.js',
        '@interisk-software/chartjs-plugin-selectdata'
      ],
      output: {
        name: 'test',
        format: 'umd',
        globals: {
          'chart.js': 'Chart',
          '@interisk-software/chartjs-plugin-selectdata': 'SelectionDataPlugin'
        }
      }
    },

    customPreprocessors: {
      fixtures: {
        base: 'rollup',
        options: {
          output: {
            format: 'iife',
            name: 'fixture'
          }
        }
      },
      sources: {
        base: 'rollup',
        options: build
      }
    }
  });

  if (args.coverage) {
    karma.reporters.push('coverage');
    karma.coverageReporter = {
      dir: 'coverage/',
      reporters: [
        {type: 'html', subdir: 'html'},
        {type: 'lcovonly', subdir: '.'}
      ]
    };
    [
      karma.rollupPreprocessor,
      karma.customPreprocessors.sources.options
    ].forEach((v) => {
      (v.plugins || (v.plugins = [])).push(
        istanbul({
          include: 'src/**/*.js'
        }));
    });
  }
};
