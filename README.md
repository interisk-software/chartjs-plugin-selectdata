# chartjs-plugin-selectdata

[![npm](https://img.shields.io/npm/v/@interisk-software/chartjs-plugin-selectdata.svg?style=flat-square)](https://npmjs.com/package/@interisk-software/chartjs-plugin-selectdata) [![CI](https://github.com/interisk-software/chartjs-plugin-selectdata/actions/workflows/ci.yml/badge.svg)](https://github.com/interisk-software/chartjs-plugin-selectdata/actions/workflows/ci.yml) [![Coverage](https://img.shields.io/codeclimate/coverage/interisk-software/chartjs-plugin-selectdata.svg?style=flat-square)](https://codeclimate.com/github/interisk-software/chartjs-plugin-selectdata)  [![Maintainability](https://img.shields.io/codeclimate/maintainability/interisk-software/chartjs-plugin-selectdata.svg?style=flat-square)](https://codeclimate.com/github/interisk-software/chartjs-plugin-selectdata)

*Data Selectable for Chart.js [Chart.js](https://www.chartjs.org)*

You can select a data in the graph and it comes into focus, emphasizing only the selected one and clicking on it disables the focus and makes the graph return to normal

This plugin requires Chart.js 2.7.0 or later.

## :rocket:	Installation

You can download the latest version of chartjs-plugin-selectdata from the [GitHub releases](https://github.com/luancaike/chartjs-plugin-selectdata/releases/latest).

To install via npm:

```bash
npm install chartjs-plugin-selectdata --save
```

To install via yarn:

```bash
yarn add chartjs-plugin-selectdata
```
To use CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@interisk-software/chartjs-plugin-selectdata"></script>
```
```html
<script src="https://unpkg.com/@interisk-software/chartjs-plugin-selectdata"></script>
```

## :man_cartwheeling: Usage

chartjs-plugin-selectdata can be used with ES6 modules, plain JavaScript and module loaders.

Include Chart.js and chartjs-plugin-selectdata.js in your page, the plugin will already be enabled.

Along with the plugin is also added as 2 new event settings `onSelection` and `onSelectionClear`

### Usage in ES6 as Module

Nothing else than importing the module should be enough.

```js

import 'chartjs-plugin-selectdata';
// or
import SelectionDataPlugin from 'chartjs-plugin-selectdata';

```

### Chart.js plugin register

In es6 with modules it is necessary to import, in plain javascript the plugin is available via windown

```js

//Chart.js v3.x.x
Chart.register(SelectionDataPlugin);

//Chart.js v2.x.x
Chart.plugins.register(SelectionDataPlugin);

```

## :gear: Configuration

The plugin options can be changed at 2 different levels and with the following priority:

- per chart: `options.plugins.selectdata.*`
- globally: `Chart.defaults.global.plugins.selectdata.*`

All available options are listed below.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| `onSelection` | `function` | `undefined` | A function that is called every time a dataset is selected. [more...](#functions)
| `onSelectionClear` | `function` | `undefined` | A function that is called every time a dataset is deselected and the graph returns to default.[more...](#functions)


### :pushpin: Functions

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

### :bar_chart:	Chart

Options available in the instance of the chart

| Name | Type | Parameters | Description
| ---- | ---- | ------- | -----------
| `clearSelection` | `function` | `none` | This function when executed resets the selection state.
| `selectDataIndex` | `function` | `number` | This function selects the dataset data according to the index.

With the functions added in the chart instance you can programmatically execute the selection actions

```js
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {/* options */})

// ...

// Wait to chart render
setTimeout(function () {
    myChart.selectDataIndex(0) // Select firt dataset data
}, 3000)

// ...

setTimeout(function () {
    myChart.clearSelection() // clear selection
}, 10000)

//...

```


## :hammer:	Building

You first need to install node dependencies (requires [Node.js](https://nodejs.org/)):

```bash
npm install
```

The following commands will then be available from the repository root:

```bash
npm run sample           # build and run sample
npm run dev              # build and run development mode using sample
npm run build            # build dist files
npm run build:dev        # build and watch for changes
npm run test             # run all tests
npm run lint             # perform code linting
npm run package          # create an archive with dist files and samples
npm run bower            # create bower.json
```

## :balance_scale: License

chartjs-plugin-selectdata is available under the [MIT license](https://opensource.org/licenses/MIT).
