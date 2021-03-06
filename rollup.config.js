const terser = require('rollup-plugin-terser').terser;
const pkg = require('./package.json');

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * 
 * (c) ${new Date().getFullYear()} ${pkg.name} contributors
 * Released under the ${pkg.license} license
 */`;

module.exports = [
  {
    input: 'src/plugin.js',
    output: ['.js', '.min.js'].map((suffix) => {
      const config = {
        exports: 'named',
        name: 'ChartSelectData',
        file: `dist/${pkg.name}${suffix}`,
        banner: banner,
        format: 'umd',
        indent: false,
        plugins: [],
        globals: {
          'chart.js': 'Chart'
        }
      };

      if (suffix.match(/\.min\.js$/)) {
        config.plugins.push(
          terser({
            output: {
              comments: /^!/
            }
          })
        );
      }

      return config;
    }),
    external: [
      'chart.js'
    ]
  }
];
