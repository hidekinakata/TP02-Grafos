const ipc = require("electron").ipcMain;
const { AdjList } = require("./algs/AdjList");
const { BrowserWindow } = require("electron");
let resultWin;
var data;
var graph;
let data2vis = {};

module.exports = (win, app) => {
    // botao de sair
    ipc.on("graph-data", function(event, arg) {
        data = arg;
        if (data.directed === 1){
            for (let i in data.edges){
                data.edges[i].arrows = 'to'
            }
        }
        graph = geraLista(arg);
        console.log("data :", data);
    });

    ipc.on("op1", (event, arg) => {
        data2vis.nodes = [];
        data2vis.edges = [];
        let res = graph.isConnected();

        for (let i = 0; i < data.node_num; i++) {
            data2vis.nodes.push({
                id: i,
                label: String(i)
            });
        }

        for (let i in res.components) {
            for (let j in res.components[i]) {
                data2vis.nodes[res.components[i][j]].group = i;
            }
        }

        data2vis.edges = data.edges;

        let msg = "";
        if (res.connected) {
            msg = "O grafo é conexo.";
        } else {
            msg = `O grafo não é conexo e contém ${
                res.components.length
            } componentes.`;
        }
        showWin(1, msg);
    });

    ipc.on("op2", (event, arg) => {
        let cores = graph.colorir();
        data2vis.nodes = [];
        data2vis.edges = data.edges;

        for (let i = 0; i < data.node_num; i++) {
            data2vis.nodes.push({
                id: i,
                label: String(i),
                group: cores[i]
            });
        }
        showWin(2, "");
    });

    ipc.on("op3", (event, arg) => {
        data2vis.nodes = [];
        data2vis.edges = [];

        for (let i = 0; i < data.node_num; i++) {
            data2vis.nodes.push({
                id: i,
                label: String(i)
            });
        }

        data2vis.edges = graph.prim(0);
        for (let i in data2vis.edges) {
            data2vis.edges[i].label = String(data2vis.edges[i].weight);
            data2vis.edges[i].font = {
                aling: "middle"
            };
            data2vis.edges[i].color = {
                color: "red"
            };
        }
        showWin(3, "");
    });

    ipc.on("op4", (event, arg) => {
        data2vis.nodes = [];
        data2vis.edges = [];

        for (let i = 0; i < data.node_num; i++) {
            data2vis.nodes.push({
                id: i,
                label: String(i)
            });
        }

        let res = graph.dijkstra(arg);

        for (let i = 0; i < res.father.length; i++) {
            if(res.father[i] !== null){
                data2vis.edges.push({
                    from: res.father[i],
                    to: i,
                });
            }
        }

        if (data.directed === 1){
            for(let i in data2vis.edges){
                data2vis.edges[i].arrows = 'to';
            }
        }

        showWin(4, `Caminho a partir do nó ${arg}`);
    });

    ipc.on("op5", (event, arg) => {
        data2vis.nodes = [];
        data2vis.edges = data.edges;

        for (let i = 0; i < data.node_num; i++) {
            data2vis.nodes.push({
                id: i,
                label: String(i)
            });
        }
        graph.componentes_fortemente_conexas(0);
        for(let i in graph.forests){
            for(let j in graph.forests[i]){
                data2vis.nodes[graph.forests[i][j]].group = i;
            }
        }
        showWin(5, "");
    });

    ipc.on("op7", (event, arg) => {
        let ordenado = graph.ordenacao_topologica(0);
        let dist = -(graph.node_num * 100/2)
        data2vis.nodes = [];
        data2vis.edges = data.edges;

        for (let i = 0; i < data.node_num; i++) {
            data2vis.nodes.push({
                id: ordenado[i],
                label: String(ordenado[i]),
                x: dist + 100*i,
                y:0
            });
        }
        showWin(7, "");
    });

    ipc.on("op8", (event, arg) => {
        data2vis.nodes = [];
        data2vis.edges = [];

        for (let i = 0; i < data.node_num; i++) {
            data2vis.nodes.push({
                id: i,
                label: String(i)
            });
        }

        let res = graph.BFS(arg);
        console.log(res)

        for (let i = 0; i < res.father.length; i++) {
            if(res.father[i] !== null){
                data2vis.edges.push({
                    from: res.father[i],
                    to: i,
                });
            }
        }

        if (data.directed === 1){
            for(let i in data2vis.edges){
                data2vis.edges[i].arrows = 'to';
            }
        }

        showWin(8, `Busca a partir do nó ${arg}`);
    });
};

function geraLista(data) {
    let directed = data.directed == 0 ? false : true;
    let graph = new AdjList(data.node_num, directed);

    data.edges.forEach(edge => {
        graph.add_edge(edge.from, edge.to, edge.weight);
    });

    return graph;
}

function showWin(opInfo, info) {
    resultWin = new BrowserWindow({
        width: 1150,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    });

    resultWin.once("ready-to-show", () => {
        resultWin.webContents.send("ready_to_show", {
            data2vis: data2vis,
            op: opInfo,
            info: info
        });
        resultWin.show();
    });

    // resultWin.webContents.openDevTools();

    resultWin.on("closed", () => {
        // Elimina a referência do objeto da janela, geralmente você iria armazenar as janelas
        // em um array, se seu app suporta várias janelas, este é o momento
        // quando você deve excluir o elemento correspondente.
        resultWin = null;
    });

    // and load the index.html of the app.
    resultWin.loadFile("./src/result.html");
}
