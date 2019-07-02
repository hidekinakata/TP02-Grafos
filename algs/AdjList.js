const NumberSet = require("./NumberSet");

class edge {
    constructor(target, weight = 1) {
        this.target = target;
        this.weight = weight;
    }
}

class AdjList {
    constructor(node_num, directed = false) {
        //default is false
        this.directed = directed; //true or false
        this.node_num = node_num;
        this.edges = [];
        this.transposed = [];
        this.stack = []; //ordenação topológica
        this.forests = [];
        this.forestCount = 0;

        for (let i = 0; i < node_num; i++) {
            this.edges.push([]);
        }

        for (let i = 0; i < node_num; i++) {
            this.edges.push([]);
            this.transposed.push([]);
            //this.forests.push([]);
        }

        this.BFS_data = null;
        this.DFS_data = null;
        this.cores = 0;
        this.coloridos = new Array(this.node_num);
        this.coloridos.fill(-1);
    }

    add_edge(sourceID, targetID, weight = 1) {
        this.edges[sourceID].push(new edge(targetID, weight));
        this.transposed[targetID].push(new edge(sourceID, weight));

        if (!this.directed)
            this.edges[targetID].push(new edge(sourceID, weight));
    }

    getNode(id) {
        let result = null;
        this.edges.forEach(node => {
            if (node.id === id) {
                result = node;
                return;
            }
        });
        return result;
    }

    getNodeIndex(id) {
        let result = null;
        this.edges.forEach((node, index) => {
            if (node.id === id) {
                result = index;
                return;
            }
        });
        return result;
    }

    dfsdata_set(startID) {
        this.DFS_data = {
            start_node: startID,
            color: new Array(this.node_num).fill("b"),
            father: new Array(this.node_num).fill(null),
            d: new Array(this.node_num).fill(null),
            f: new Array(this.node_num).fill(null),
            time: 0
        };
    }

    bfsdata_set(startID) {
        this.BFS_data = {
            start_node: startID,
            color: new Array(this.node_num).fill("b"),
            father: new Array(this.node_num).fill(null),
            dist: new Array(this.node_num).fill(NaN)
        };
    }

    DFS(startID) {
        this.dfsdata_set(startID);
        let list = [];
        for (let i = 0; i < this.node_num; i++) {
            if (startID === i) list.unshift(i);
            else list.push(i);
        }

        for (let i in list) {
            if (this.DFS_data.color[list[i]] === "b") this.DFS_VISIT(list[i]);
        }

        return this.DFS_data;
    }

    DFS_VISIT(node) {
        this.DFS_data.color[node] = "c";
        this.DFS_data.time += 1;
        this.DFS_data.d[node] = this.DFS_data.time;

        for (let i in this.edges[node]) {
            let v = this.edges[node][i].target;
            if (this.DFS_data.color[v] === "b") {
                this.DFS_data.father[v] = node;
                this.DFS_VISIT(v);
            }
        }

        this.stack.push(node); //ordenação topológica
        this.DFS_data.color[node] = "p";
        this.DFS_data.f[node] = this.DFS_data.time += 1;
    }

    BFS(startID) {
        this.bfsdata_set(startID);
        this.BFS_data.color[startID] = "c";
        this.BFS_data.dist[startID] = 0;

        var queue = [];
        queue.push(startID);

        while (queue.length > 0) {
            var u = queue.shift();

            for (let i in this.edges[u]) {
                let v = this.edges[u][i].target;
                if (this.BFS_data.color[v] === "b") {
                    this.BFS_data.color[v] = "c";
                    this.BFS_data.dist[v] = this.BFS_data.dist[u] + 1;
                    this.BFS_data.father[v] = u;
                    queue.push(v);
                }
            }
            this.BFS_data.color[u] = "p";
        }

        return this.BFS_data;
    }

    searchBy_bfs(startID, keyID) {
        let caminho = [];
        let atual = keyID;
        if (this.BFS_data != null) {
            while (this.BFS_data.father[atual] != null) {
                caminho.unshift({
                    from: this.BFS_data.father[atual],
                    to: atual
                });
                atual = this.BFS_data.father[atual];
                if (atual === startID) break;
            }
        } else {
            this.BFS(startID);
            return this.searchBy_bfs(startID, keyID);
        }

        if (atual !== startID) {
            if (this.BFS_data.start_node === startID) return null;
            else {
                this.BFS(startID);
                return this.searchBy_bfs(startID, keyID);
            }
        } else {
            return caminho.length > 0 ? caminho : null;
        }
    }

    searchBy_dfs(startID, keyID) {
        let caminho = [];
        let atual = keyID;
        if (this.DFS_data != null) {
            while (this.DFS_data.father[atual] != null) {
                caminho.unshift({
                    from: this.DFS_data.father[atual],
                    to: atual
                });
                atual = this.DFS_data.father[atual];
                if (atual === startID) break;
            }
        } else {
            this.DFS(startID);
            return this.searchBy_dfs(startID, keyID);
        }

        if (atual !== startID) {
            if (this.DFS_data.start_node === startID) return null;
            else {
                this.DFS(startID);
                return this.searchBy_dfs(startID, keyID);
            }
        } else {
            return caminho.length > 0 ? caminho : null;
        }
    }

    isConnected() {
        let sets = [];

        for (let i = 0; i < this.node_num; i++) {
            let set = new NumberSet();
            set.add(i);
            sets.push(set);
        }

        for (let i = 0; i < this.edges.length; i++) {
            for (let j = 0; j < this.edges[i].length; j++) {
                let set1, set2;
                for (let k in sets) {
                    if (sets[k].has(i)) set1 = sets[k];
                    if (sets[k].has(this.edges[i][j].target)) set2 = sets[k];
                }
                if (!set1.equals(set2)) {
                    sets.push(set1.union(set2));
                    sets.splice(sets.indexOf(set1), 1);
                    sets.splice(sets.indexOf(set2), 1);
                }
            }
        }
        return {
            connected: sets.length === 1,
            components: sets
        };
    }

    kruskal() {
        if (this.directed && !this.isConnected.connected) return null;

        let sets = [];
        let edges = [];

        for (let i = 0; i < this.node_num; i++) {
            let set = new NumberSet();
            set.add(i);
            sets.push(set);
        }

        for (let i = 0; i < this.edges.length; i++) {
            for (let j = 0; j < this.edges[i].length; j++) {
                edges.push({
                    from: i,
                    to: this.edges[i][j].target,
                    weight: this.edges[i][j].weight
                });
            }
        }

        let set1,
            set2,
            tree = [];
        edges.sort((a, b) => {
            return a.weight - b.weight;
        });
        console.log("edges :", edges);

        for (let i in edges) {
            for (let k in sets) {
                if (sets[k].has(edges[i].from)) set1 = sets[k];
                if (sets[k].has(edges[i].to)) set2 = sets[k];
            }
            if (!set1.equals(set2)) {
                sets.push(set1.union(set2));
                sets.splice(sets.indexOf(set1), 1);
                sets.splice(sets.indexOf(set2), 1);
                tree.push(edges[i]);
            }
        }

        return tree;
    }

    prim(startID) {
        function ordena(a, b) {
            return d[a] - d[b];
        }

        let tree = [];
        let d = new Array(this.node_num).fill(Infinity);
        let father = new Array(this.node_num).fill(null);
        d[startID] = 0;
        let Q = [];

        for (let i = 0; i < this.node_num; i++) Q.push(i);
        Q.sort(ordena);
        while (Q.length != 0) {
            let u = Q.shift();

            for (let i in this.edges[u]) {
                let v = this.edges[u][i].target;
                let w = this.edges[u][i].weight;
                if (Q.indexOf(v) >= 0 && w < d[v]) {
                    d[v] = w;
                    father[v] = u;
                }
            }

            if (u !== startID)
                tree.push({
                    from: u,
                    to: father[u],
                    weight: d[u]
                });

            Q.sort(ordena);
        }

        return tree;
    }

    dijkstra(startID) {
        function sort(a, b) {
            return d[a] - d[b];
        }
        let d = new Array(this.node_num).fill(Infinity);
        let father = new Array(this.node_num).fill(null);
        let Q = [];
        let S = [];

        for (let i = 0; i < this.node_num; i++) Q.push(i);
        d[startID] = 0;
        Q.sort(sort);

        while (Q.length != 0) {
            let u = Q.shift();

            S.push(u);
            for (let i = 0; i < this.edges[u].length; i++) {
                let v = this.edges[u][i].target;
                if (d[v] > d[u] + this.edges[u][i].weight) {
                    d[v] = d[u] + this.edges[u][i].weight;
                    father[v] = u;
                }
            }
            Q.sort(sort);
        }
        return {
            father: father,
            dist: d
        };
    }

    bellman_ford(startID) {
        let d = new Array(this.node_num).fill(Infinity);
        let father = new Array(this.node_num).fill(null);
        d[startID] = 0;

        for (let i = 1; i < this.node_num; i++) {
            for (let u = 0; u < this.node_num; u++) {
                for (let j in this.edges[u]) {
                    let v = this.edges[u][j].target;
                    if (d[v] > d[u] + this.edges[u][j].weight) {
                        d[v] = d[u] + this.edges[u][j].weight;
                        father[v] = u;
                    }
                }
            }
        }

        for (let u = 0; u < this.node_num; u++) {
            for (let j in this.edges[u]) {
                let v = this.edges[u][j].target;
                if (d[v] > d[u] + this.edges[u][j].weight) {
                    return null;
                }
            }
        }

        return {
            father: father,
            dist: d
        };
    }

    toString() {
        this.edges.forEach(node => {
            let info = node.id.toString() + " | ";
            node.edges.forEach((edge, i) => {
                info += `${edge.target.id} `;
                if (node.edges.length - 1 > i) info += "-> ";
            });
            console.log(info);
        });
    }

    ordenacao_topologica(startID) {
        this.DFS(startID);
        let ordenado = [];

        for (let i = 0; i < this.node_num; i++) {
            ordenado.push(this.stack.pop());
        }
        return ordenado;
    }


    colore_vertice(k){
        let coloriu = false;
        let valido;
        if (this.coloridos[k] === -1){
            for(let cor = 0; cor <= this.cores; cor++){
                valido = true;
                for(let v = 0; v < this.edges[k].length; v++){
                    if(this.coloridos[this.edges[k][v].target] === cor){
                        valido = false;
                    }
                }
                if (valido){
                    this.coloridos[k] = cor;
                    coloriu = true;
                    break;
                }
            }    
            if(!coloriu){
                this.coloridos[k] = ++this.cores;
            }
            for(let v = 0; v < this.edges[k].length; v++){
                this.colore_vertice(this.edges[k][v].target)
            }
        }
    }

    colorir() {
        let lista = [];
        let maior_grau = 0;

        for (let i = 1; i < this.node_num; i++) {
            if (this.edges[i].length > this.edges[maior_grau].length) {
                maior_grau = i;
            }
        }
        console.log('maior_grau :', maior_grau);
        for (let i = 0; i < this.node_num; i++) {
            if (i !== maior_grau) lista.push(i);
            else lista.unshift(i);
        }

        for (let i in lista) {
            this.colore_vertice(lista[i]);
            console.log('coloridos :', this.coloridos);
        }

        return this.coloridos;
    }

    transposto(){
        for(let i = 0; i < this.transposed.length; i++){
            console.log('O vértice '+i+' vai para:');
            for(let j = 0; j < this.transposed[i].length; j++){
                console.log(this.transposed[i][j].target);
            }
        }
    }

    componentes_fortemente_conexas(startID){
        this.stack = [];
        this.DFS(startID);

        let list = []; //com a ordem decrescente
        this.forestCount = 0;
        this.forests = [];

        for (let i = 0; i < this.node_num; i++) {
            list.push(this.stack.pop());
            this.forests.push([]);
        }

        this.DFS_TRANSPOSED(list);

        for(let i = 0; i < this.forestCount; i++){
            for(let j = 0; j < this.forests[i].length; j++){
                console.log(this.forests[i][j]);
            }
            console.log('');
        }
    }

    DFS_TRANSPOSED(list) {
        this.dfsdata_set(list[0]);

        for (let i in list) {
            if (this.DFS_data.color[list[i]] === 'b'){
                this.DFS_VISIT_TRANSPOSED(list[i]);  
                this.forestCount++;
            } 
        }

        return this.DFS_data;
    }

    DFS_VISIT_TRANSPOSED(node) {
        this.DFS_data.color[node] = 'c';
        this.DFS_data.time += 1;
        this.DFS_data.d[node] = this.DFS_data.time;

        for (let i in this.transposed[node]) {
            let v = this.transposed[node][i].target;
            if (this.DFS_data.color[v] === 'b') {
                this.DFS_data.father[v] = node;
                this.DFS_VISIT_TRANSPOSED(v)
            }
        }

        this.forests[this.forestCount].push(node);
        this.DFS_data.color[node] = 'p';
        this.DFS_data.f[node] = this.DFS_data.time += 1;
    }
}

module.exports = { AdjList, edge };