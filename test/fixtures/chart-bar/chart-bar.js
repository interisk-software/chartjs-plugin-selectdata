export default {
  config: {
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
      elements: {
        rectangle: {
          backgroundColor: '#444',
        }
      },
      layout: {
        padding: 20
      }
    }
  },
  options: {
    canvas: {
      height: 256,
      width: 256
    }
  }
};
