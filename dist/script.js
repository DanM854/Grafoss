var nodes, edges, network;

// convenience method to stringify a JSON object
function toJSON(obj) {
  return JSON.stringify(obj, null, 4);
}

//agregar un vertice
function addNode() {
  try {
    var id = document.getElementById("node-id").value;
    var peso = document.getElementById("node-peso").value;
    var label = document.getElementById("node-label").value + " (" + peso + ")";
    var level = parseInt(document.getElementById("node-level").value);

    nodes.add({
      id: id,
      label: label,
      y: level * 100, // Ajustar la posición vertical en función del nivel
      level: level,  // Agregar el valor del nivel al nodo
    });

    nodesUndoStack.push({
      type: "add",
      data: { id: id, label: label, level: level }, //deshace la ultima accion
    });

  } catch (err) {//deshace la ultima accion
    alert(err);
  }
}

//actualizar nodo
function updateNode() {
  try {
    var id = document.getElementById("node-id").value;
    var peso = document.getElementById("node-peso").value;
    var label = document.getElementById("node-label").value + " (" + peso + ")";
    var level = parseInt(document.getElementById("node-level").value);

    nodes.update({
      id: id,
      label: label,
      y: level * 100, // Ajustar la posición vertical en función del nivel
      level: level,  // Actualizar el valor del nivel del vértice
    });

    nodesUndoStack.push({ type: "updateNode", data: { id: id, label: label } }); //deshace la ultima accion
    
  } catch (err) {
    alert(err);
  }
}

//eliminar nodo
function removeNode() {
  try {
    nodes.remove({ id: document.getElementById("node-id").value });

    nodesUndoStack.push({ type: "removeNode", data: { id: id, label: label } }); //deshace la ultima accion

  } catch (err) {
    alert(err);
  }
}

//agregar arista
function addEdge() {
  try {
    var id = document.getElementById("edge-id").value;
    var from = document.getElementById("edge-from").value;
    var to = document.getElementById("edge-to").value;
    var direction = document.getElementById("edge-direction").value;
    
    var edgeOptions = {
      id: id,
      from: from,
      to: to,
      label: document.getElementById("edge-label").value,
    };

    if (direction === "unidireccional") {
      edgeOptions.arrows = "to";
    }

    edges.add(edgeOptions);

    edgesUndoStack.push({ //deshace la ultima accion
      type: "add",
      data: { id: id, from: from, to: to, label: label },
    });

  } catch (err) {
    alert(err);
  }
}

//actualizar arista
function updateEdge() {
  try {
    edges.update({
      id: document.getElementById("edge-id").value,
      from: document.getElementById("edge-from").value,
      to: document.getElementById("edge-to").value,
      label: document.getElementById("edge-label").value,
    });

    edgesUndoStack.push({ type: "updateEdge", data: { id: id, label: label } }); //deshace la ultima accion

  } catch (err) {
    alert(err);
  }
}

//eliminar arista
function removeEdge() {
  try {
    edges.remove({ id: document.getElementById("edge-id").value });

    edgesUndoStack.push({ type: "removeEdge", data: { id: id, label: label } }); //deshace la ultima accion

  } catch (err) {
    alert(err);
  }
}

//pilas para el boton deshacer
var nodesUndoStack = [];
var edgesUndoStack = [];

//funcion deshacer
function undo() {
  if (nodesUndoStack.length > 0) {
    var lastChange = nodesUndoStack.pop();
    switch (lastChange.type) {
      case "addNode":
        nodes.remove({ id: lastChange.data.id });
        break;
      case "updateNode":
        nodes.update(lastChange.data);
        break;
      case "removeNode":
        nodes.add(lastChange.data);
        break;
    }
  }

  if (edgesUndoStack.length > 0) {
    var lastChange = edgesUndoStack.pop();
    switch (lastChange.type) {
      case "addEdge":
        edges.remove({ id: lastChange.data.id });
        break;
      case "updateEdge":
        edges.update(lastChange.data);
        break;
      case "removeEdge":
        edges.add(lastChange.data);
        break;
    }
  }
}

//funcion para dibujar el grafo
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
    { id: "1",peso:peso, label: " 1 " + "("+(peso)+")", level: 1 },
    { id: "2",peso:peso,label: " 2" + "("+(peso)+")", level: 2 },
    { id: "3", peso:peso,label: " 3" + "("+(peso)+")", level: 2 },
    { id: "4",peso:peso ,label: " 4" + "("+(peso)+")", level: 3 },
    //{ id: "5", peso:peso,label: "Node 5" + "("+(peso)+")", level: 3},
  ]);

  //
  edges = new vis.DataSet();
  edges.on("*", function () {
    document.getElementById("edges").innerText = JSON.stringify(
      edges.get(),
      null,
      4
    );
  });

  //aristas predefinidas
  edges.add([
    { id: "1", from: "1", to: "2" },
    { id: "2", from: "1", to: "3" },
    { id: "3", from: "1", to: "4" },
    { id: "4", from: "2", to: "1" },
    { id: "5", from: "2", to: "4" },
    { id: "6", from: "3", to: "1" },
    { id: "7", from: "3", to: "4" },

    //{ id: "5", from: "3", to: "4", arrows: "to" },
    //{ id: "6", from: "4", to: "5", arrows: "to" },
  
  ]);

  //opciones para el funcionamiento
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges,
  };

  //opciones 
  var options = {
    //fisicas desactivadas
    physics: {
      enabled: false,
  },
    //formato de las aristas
    edges: {
      smooth: true,
    },
    //una plantilla para ordenar los vertices
    layout: {
      hierarchical: {
        enabled: true,
        sortMethod: "directed", //metodo de ordenamiento
        direction: "LR", //direccion en la que se ordena LR = left to Right
        improvedLayout: true, // Habilitar el layout jerárquico mejorado
      },
    },

    //formato de los vertices/nodos
    nodes: {
      font: {
        size: 14, //tamaño
        color: "#000000", //color de la letra
        face: "times new roman", //fuente
      },
    },
  };
    
  network = new vis.Network(container, data, options);
}


window.addEventListener("load", () => {
  draw();
});