var nodes, edges, network;

// convenience method to stringify a JSON object
function toJSON(obj) {
  return JSON.stringify(obj, null, 4);
}

function addNode() {
  try {
    var id = document.getElementById("node-id").value;
    var peso = document.getElementById("node-peso").value;
    var label = document.getElementById("node-label").value + " (" + peso + ")";
    nodes.add({
      id: id,
      label: label,
    });
  } catch (err) {
    alert(err);
  }
}

function updateNode() {
  try {
    var id = document.getElementById("node-id").value;
    var peso = document.getElementById("node-peso").value;
    var label = document.getElementById("node-label").value + " (" + peso + ")";
    nodes.update({
      id: id,
      label: label,
    });
  } catch (err) {
    alert(err);
  }
}
function removeNode() {
  try {
    nodes.remove({ id: document.getElementById("node-id").value });
  } catch (err) {
    alert(err);
  }
}

function addEdge() {
  try {
    edges.add({
      id: document.getElementById("edge-id").value,
      from: document.getElementById("edge-from").value,
      to: document.getElementById("edge-to").value,
      label: document.getElementById("edge-label").value,
    });
  } catch (err) {
    alert(err);
  }
}
function updateEdge() {
  try {
    edges.update({
      id: document.getElementById("edge-id").value,
      from: document.getElementById("edge-from").value,
      to: document.getElementById("edge-to").value,
      label: document.getElementById("edge-label").value,
    });
  } catch (err) {
    alert(err);
  }
}
function removeEdge() {
  try {
    edges.remove({ id: document.getElementById("edge-id").value });
  } catch (err) {
    alert(err);
  }
}

function draw() {
  // create an array with nodes
  nodes = new vis.DataSet();
  nodes.on("*", function () {
    document.getElementById("nodes").innerText = JSON.stringify(
      nodes.get(),
      null,
      4
    );
  });
  // Define un valor de peso común
  var peso = "0";
  //var pesoComun = "1";
  nodes.add([
    { id: "1",peso:peso, label: "Node 1 " + "("+(peso)+")" },
    { id: "2",peso:peso,label: "Node 2" + "("+(peso)+")" },
    { id: "3", peso:peso,label: "Node 3" + "("+(peso)+")" },
    { id: "4",peso:peso ,label: "Node 4" + "("+(peso)+")" },
    { id: "5", peso:peso,label: "Node 5" + "("+(peso)+")"},
  ]);

  // create an array with edges
  edges = new vis.DataSet();
  edges.on("*", function () {
    document.getElementById("edges").innerText = JSON.stringify(
      edges.get(),
      null,
      4
    );
  });
  edges.add([
    { id: "1", from: "1", to: "2" },
    { id: "2", from: "1", to: "3" },
    { id: "3", from: "2", to: "4" },
    { id: "4", from: "2", to: "5" },
  ]);

  // create a network
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
      physics: {
    enabled: false,
    solver: "barnesHut",
    barnesHut: {
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 0,
      springConstant: 0,
      damping: 0.09,
    },
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 50,
    },
  },
    edges: {
      smooth: false,
    },
  layout: {
    hierarchical: {
      enabled: true,
      sortMethod: "directed",
      direction: "LR",
      improvedLayout: true, // Habilitar el layout jerárquico mejorado
    },
  },
     nodes: {
      font: {
        size: 14, // Tamaño de la fuente
        color: "#000000", 
        face: "times new roman", 
      },
    },
  };
    
  network = new vis.Network(container, data, options);
}

window.addEventListener("load", () => {
  draw();
});