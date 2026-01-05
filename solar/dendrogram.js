function fetchJSONData(file) {
  return fetch(file)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Failed to fetch data:', error);
      throw error;
    });
}


function drawdend(html, file) {
  const { Graph } = G6;
let section = document.querySelector('section');
let secwid = section.clientWidth;
let sechei = section.clientHeight;
console.log(secwid)
if (secwid>=900){
  fetchJSONData(file)
    .then(jsondata => {
      const graph = new Graph({
        container: html,
        autoFit: 'view',

        data: jsondata,

        node: {
          style: {
            fill: '#fff',
            size: 20,
            labelPlacement: 'bottom',
            labelText: (d) => d.data.label,
            labelFill: '#fff',
            labelFontSize: 22
          },
          palette: {
            field: 'group',
            color: 'tableau',
          },
        },

        layout: {
          type: 'antv-dagre',
          rankdir: 'TB',
          
          manyBody: {},
          x: {},
          y: {},
        },
edge: {
    type: 'polyline',   
    style: {
      radius: 0,        
      offset: 0, 
      lineWidth: 4   
    },
    router: {
      type: 'orth',  
      offset: 12   
    },
  },
plugins: [
    {
      type: 'background',
      background: '#000'
    },
  ],

        behaviors: [
          'drag-canvas',
          'auto-adapt-label',
          'drag-element',
          'hover-activate'
        ],
      });

      graph.render();
    });
}
else{
      fetchJSONData(file)
    .then(jsondata => {
      const graph = new Graph({
        container: html,
        width: secwid,
        autoFit: 'view',

        data: jsondata,

        node: {
          style: {
            fill: '#fff',
            size: 20,
            labelPlacement: 'bottom',
            labelText: (d) => d.data.label,
            labelFill: '#fff',
            labelFontSize: 22
          },
          palette: {
            field: 'group',
            color: 'tableau',
          },
        },

        layout: {
          type: 'antv-dagre',
          rankdir: 'TB',
          
          manyBody: {},
          x: {},
          y: {},
        },
edge: {
    type: 'polyline',   
    style: {
      radius: 0,        
      offset: 0, 
      lineWidth: 4   
    },
    router: {
      type: 'orth',  
      offset: 12   
    },
  },
plugins: [
    {
      type: 'background',
      background: '#000'
    },
  ],

        behaviors: [
          'drag-canvas',
          'auto-adapt-label',
          'drag-element',
          'hover-activate'
        ],
      });

      graph.render();
    });
}
}

