const ipc = require("electron").ipcRenderer;

var container = document.getElementById("mynetwork");

ipc.on("ready_to_show", (event, arg) => {
    var options = {
        nodes: {
            size: 30,
            font: {
                size: 25
            },
            borderWidth: 2
        },
        edges: {
            width: 2,
            font: {
                size: 25
            }
        }
    };

    switch (arg.op) {
        case 1:
            $("#labelOperacao").text("Componentes Conexas");
            $("#infolabel").text(arg.info);
            break;
        case 2:
                $("#labelOperacao").text("Coloração");
            break;
        case 3:
            $("#labelOperacao").text("Arvore geradora mínima");
            break;
        case 4:
            $("#labelOperacao").text("Caminho mínimo");
            $("#infolabel").text(arg.info);
            break;
        case 5:
            $("#labelOperacao").text("Componentes Fortemente Conexas");
            break;
        case 6:
            break;
        case 7:
            $("#labelOperacao").text("Ordenação Topológica");
            options.physics = false;
            options.edges.smooth = {
                type: "curvedCW",
                forceDirection: "none",
                forceDirection: "none",
                roundness: 0.7
            };
            break;
        case 8:
            $("#labelOperacao").text("Busca em largura");
            $("#infolabel").text(arg.info);
            break;
    }

    VisNetwork = new vis.Network(container, arg.data2vis, options);
});
