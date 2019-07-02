const ipc = require('electron').ipcRenderer;
var data;

// EVENTS

$('#exitBtn').click(() => {
    ipc.send('close-operation')
})


$('#op1').click(() => {
    ipc.send('op1');
})

$('#op2').click(() => {
    ipc.send('op2');
})

$('#op3').click(() => {
    ipc.send('op3');
})

$('#op4').click(() => {
    $('#modal_op4').modal()
})

$('#ok_op4').click(() => {
    ipc.send('op4', $("#arg_op4").val());
})

$('#op5').click(() => {
    ipc.send('op5');
})

$('#op6').click(() => {
    ipc.send('op6');
})
$('#op7').click(() => {
    ipc.send('op7');
})

$('#op8').click(() => {
    $('#modal_op8').modal()
})

$('#ok_op8').click(() => {
    ipc.send('op8', $("#arg_op8").val());
})


$('#loadBtn').click(() => {
    $('#fileInput').click();
})

$("#fileInput").on("input", () => {
    if ($("#fileInput")[0].files[0] === undefined) return;
    // $("#fname_label").text($("#fileInput")[0].files[0].name);

    var reader = new FileReader();
    reader.onload = () => {
        data = consistence(reader.result);
        if(data == null){
            window.alert("Houve um erro ao carregar seu grafo :(")
            return;
        }
        $("#fileInput")[0] = undefined;
        $("#labelDirecionado").text(data.directed == 0 ? "Não" : "Sim");
        $("#labelNos").text(data.node_num);
        $("#labelArestas").text(data.edges.length);
        $("#opBtn").removeAttr("disabled");
        $("#fileInput").val("");
        ipc.send('graph-data', data);
    };
    reader.readAsText($("#fileInput")[0].files[0]);
});



// verifica se o arquivo lido está OK, se sim, retorna um objeto contendo os dados, se nao, retorna null.

function consistence(str_graph){
    var args = str_graph.split('\n');
    var type = args[0].match(/\S+/g), 
        node_num = args[1].match(/\S+/g), 
        edges = args.slice(2);
    var graph = {};
    
    if (type.length === 1) graph.directed = Number(type[0]);
    else return null;
    
    if(node_num.length === 1) graph.node_num = Number(node_num[0]);
    else return null;
    
    graph.edges = [];
    var valid_edges = true
    
    edges.forEach( (edge) => {
        var aux = edge.match(/\S+/g);
        if(aux.length === 3) {
            graph.edges.push({
                from: Number(aux[0]),
                to: Number(aux[1]),
                weight: Number(aux[2])
            })
        }
        else return valid_edges = false
    });
    
    
    if (valid_edges) return graph;
    else return null;
    
}