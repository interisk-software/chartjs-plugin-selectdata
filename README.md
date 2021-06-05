# chartjs-plugin-selectdata

[![npm](https://img.shields.io/npm/v/chartjs-plugin-selectdata.svg?style=flat-square)](https://npmjs.com/package/chartjs-plugin-selectdata) [![CI](https://github.com/luancaike/chartjs-plugin-selectdata/actions/workflows/ci.yml/badge.svg)](https://github.com/luancaike/chartjs-plugin-selectdata/actions/workflows/ci.yml) [![Coverage](https://img.shields.io/codeclimate/coverage/luancaike/chartjs-plugin-selectdata.svg?style=flat-square)](https://codeclimate.com/github/luancaike/chartjs-plugin-selectdata)  [![Maintainability](https://img.shields.io/codeclimate/maintainability/luancaike/chartjs-plugin-selectdata.svg?style=flat-square)](https://codeclimate.com/github/luancaike/chartjs-plugin-selectdata)

*Data Selectable for Chart.js [Chart.js](https://www.chartjs.org)*

You can select a data in the graph and it comes into focus, emphasizing only the selected one and clicking on it disables the focus and makes the graph return to normal

This plugin requires Chart.js 2.7.0 or later.

## Installation

You can download the latest version of chartjs-plugin-selectdata from the [GitHub releases](https://github.com/luancaike/chartjs-plugin-selectdata/releases/latest).

To install via npm:

```bash
npm install chartjs-plugin-selectdata --save
```

To install via yarn:

```bash
yarn add chartjs-plugin-selectdata
```

## Usage

chartjs-plugin-selectdata can be used with ES6 modules, plain JavaScript and module loaders.

Include Chart.js and chartjs-plugin-selectdata.js in your page, the plugin will already be enabled.

Along with the plugin is also added as 2 new event settings `onSelection` and `onSelectionClear`

### Usage in ES6 as Module

Nothing else than importing the module should be enough.

```js
import 'chartjs-plugin-selectdata';
```

## Configuration

The plugin options can be changed at 2 different levels and with the following priority:

- per chart: `options.plugins.selectdata.*`
- globally: `Chart.defaults.global.plugins.selectdata.*`

All available options are listed below.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| `onSelection` | `function` | `undefined` | A function that is called every time a dataset is selected. [more...](#functions)
| `onSelectionClear` | `function` | `undefined` | A function that is called every time a dataset is deselected and the graph returns to default.[more...](#functions)

### Functions

With the callback functions you can perform actions based on the interactions with the graph.

```js
var onSelection = function(dataSelection) {
    console.log(dataSelection)
};

var onSelectionClear = function(dataSelection) {
    console.log('it is clean')
};

// ...
options: {
    plugins: {
        selectdata: {
            onSelection: onSelection,
            onSelectionClear: onSelectionClear
        }
    }
}
//...

```
### `dataSelection` properties

| Name | Type  | Description
| ---- | ----  | -----------
| `datasetIndex` | `number[]`  |  Array of indexes of the selected dataset.
| `index` | `number`  |  label index based on selection


## Building

You first need to install node dependencies (requires [Node.js](https://nodejs.org/)):

```bash
npm install
```

The following commands will then be available from the repository root:

```bash
npm run build            # build dist files
npm run build:dev        # build and watch for changes
npm run test             # run all tests
npm run lint             # perform code linting
npm run package          # create an archive with dist files and samples
npm run bower            # create bower.json
```

## License

chartjs-plugin-selectdata is available under the [MIT license](https://opensource.org/licenses/MIT).
