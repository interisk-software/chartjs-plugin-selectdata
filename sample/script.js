/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

const data = [12, 19, 3, 5, 2, 3];
const labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
let ctxBarChart = document.getElementById('barChart').getContext('2d');
let barChart = new Chart(ctxBarChart, {
  type: 'bar',
  data: {
    labels,
    datasets: [{
      label: '# of Votes',
      data,
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    plugins: {
      selectdata: {
        onSelection: function(dataSelection) {

        },
        onSelectionClear: function(dataSelection) {
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

let ctxLineChart = document.getElementById('lineChart').getContext('2d');
let lineChart = new Chart(ctxLineChart, {
  type: 'line',
  data: {
    labels,
    datasets: [
      {
        fill: false,
        pointRadius: 5,
        label: '# of Votes',
        data,
        borderColor: 'rgb(75, 192, 192)',
        pointBackgroundColor: 'rgb(75, 192, 192)'
      }
    ]
  },
  options: {
    plugins: {
      selectdata: {
        onSelection: function(dataSelection) {

        },
        onSelectionClear: function(dataSelection) {
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

let ctxRadarChart = document.getElementById('radarChart').getContext('2d');
let radarChart = new Chart(ctxRadarChart, {
  type: 'radar',
  data: {
    labels: [
      'Eating',
      'Drinking',
      'Sleeping',
      'Designing',
      'Coding',
      'Cycling',
      'Running'
    ],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 90, 81, 56, 55, 40],
        fill: true,
        pointRadius: 5,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }, {
        label: 'My Second Dataset',
        data: [28, 48, 40, 19, 96, 27, 100],
        fill: true,
        pointRadius: 5,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }
    ]
  },
  options: {
    plugins: {
      selectdata: {
        onSelection: function(dataSelection) {

        },
        onSelectionClear: function(dataSelection) {
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

let ctxPieChart = document.getElementById('pieChart').getContext('2d');
let pieChart = new Chart(ctxPieChart, {
  type: 'pie',
  data: {
    labels: [
      'Red',
      'Blue',
      'Yellow'
    ],
    datasets: [
      {
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }
    ]
  },
  options: {
    plugins: {
      selectdata: {
        onSelection: function(dataSelection) {

        },
        onSelectionClear: function(dataSelection) {
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
