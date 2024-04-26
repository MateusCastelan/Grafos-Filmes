const fs = require('fs');
const dados = fs.readFileSync('latest_movies.json');
const dadosJSON = JSON.parse(dados);


class Grafo {
    constructor() {
        // Utilizamos um Map para armazenar a lista de adjacências.
        // A chave é o vértice e o valor é um array de vértices adjacentes.
        this.listaAdj = new Map();
    }

    // Método para adicionar um vértice ao grafo.
    adicionarVertice(vertice) {
        // Verificamos se o vértice já existe no grafo.
        if (!this.listaAdj.has(vertice)) {
            // Se não existe, adicionamos o vértice com uma lista vazia de adjacências.
            this.listaAdj.set(vertice, []);
        }
    }

    // Método para adicionar uma aresta entre dois vértices.
    adicionarAresta(vertice1, vertice2) {
        // Adicionamos vertice2 à lista de adjacências de vertice1 e vice-versa.
        this.listaAdj.get(vertice1).push(vertice2);
        this.listaAdj.get(vertice2).push(vertice1);
    }

    mostrarGrafo() {
        for (let [vertice, adjacentes] of this.listaAdj) {
            console.log(`${vertice} -> ${adjacentes.join(', ')}`);
        }
    }

    bfs(origem, destino) {
        // Estrutura para armazenar o caminho encontrado.
        const caminho = [];
        // Estrutura para armazenar os vértices visitados.
        const visitados = new Set();
        // Estrutura de fila para o algoritmo BFS.
        const fila = [[origem]];

        // Verifica se o vértice de origem existe no grafo.
        if (!this.listaAdj.has(origem)) {
            console.log(`O vértice ${origem} não existe no grafo.`);
            return null;
        }

        // Enquanto houver vértices na fila.
        while (fila.length) {
            // Remove o primeiro caminho da fila.
            const caminhoAtual = fila.shift();
            // Pega o último vértice do caminho atual.
            const verticeAtual = caminhoAtual[caminhoAtual.length - 1];

            // Se o vértice atual for o destino, retornamos o caminho.
            if (verticeAtual === destino) {
                return caminhoAtual;
            }

            // Se o vértice atual não foi visitado.
            if (!visitados.has(verticeAtual)) {
                // Marca o vértice como visitado.
                visitados.add(verticeAtual);

                // Para cada vértice adjacente ao vértice atual.
                for (const adjacente of this.listaAdj.get(verticeAtual)) {
                    // Cria um novo caminho adicionando o vértice adjacente ao caminho atual.
                    const novoCaminho = [...caminhoAtual, adjacente];
                    // Adiciona o novo caminho à fila.
                    fila.push(novoCaminho);
                }
            }
        }

        // Se não houver caminho entre a origem e o destino.
        console.log(`Não há um caminho entre ${origem} e ${destino}.`);
        return null;
    }


    encontrarCaminhoMinimo(origem, destino) {
        const caminho = this.bfs(origem, destino);
        if (caminho) {
            const comprimento = caminho.length - 1;
            return { caminho, comprimento };
        }
        return null;
    }

    encontrarRelacionamentosProximos(origem, destino) {
        // Estrutura para armazenar os relacionamentos mais próximos encontrados.
        const relacionamentosProximos = [];
        // Estrutura para armazenar os vértices visitados.
        const visitados = new Set();
        // Estrutura de fila para o algoritmo BFS.
        const fila = [[origem]];

        // Verifica se o vértice de origem existe no grafo.
        if (!this.listaAdj.has(origem)) {
            console.log(`O vértice ${origem} não existe no grafo.`);
            return relacionamentosProximos;
        }

        // Enquanto houver vértices na fila.
        while (fila.length) {
            // Remove o primeiro caminho da fila.
            const caminhoAtual = fila.shift();
            // Pega o último vértice do caminho atual.
            const verticeAtual = caminhoAtual[caminhoAtual.length - 1];

            // Se o comprimento do caminho atual for maior que 6, paramos a busca.
            if (caminhoAtual.length > 6) {
                break;
            }

            // Se o vértice atual for o destino, adicionamos o caminho ao resultado.
            if (verticeAtual === destino) {
                relacionamentosProximos.push(caminhoAtual);
                continue; // Continuamos a busca para encontrar outros caminhos.
            }

            // Se o vértice atual não foi visitado.
            if (!visitados.has(verticeAtual)) {
                // Marca o vértice como visitado.
                visitados.add(verticeAtual);

                // Para cada vértice adjacente ao vértice atual.
                for (const adjacente of this.listaAdj.get(verticeAtual)) {
                    // Cria um novo caminho adicionando o vértice adjacente ao caminho atual.
                    const novoCaminho = [...caminhoAtual, adjacente];
                    // Adiciona o novo caminho à fila.
                    fila.push(novoCaminho);
                }
            }
        }

        // Retornamos os relacionamentos mais próximos encontrados.
        return relacionamentosProximos;
    }
}


// Função para popular o grafo a partir de dados em formato JSON.
function popularGrafo(dados) {
    const grafo = new Grafo();

    // Iteramos sobre cada filme no JSON.
    dados.forEach(filme => {
        const tituloFilme = filme.title;
        // Adicionamos o título do filme como um vértice no grafo.
        grafo.adicionarVertice(tituloFilme);

        // Iteramos sobre o elenco do filme.
        filme.cast.forEach(ator => {
            // Adicionamos cada ator como um vértice no grafo, se ainda não existir.
            grafo.adicionarVertice(ator);
            // Criamos uma aresta entre o filme e o ator.
            grafo.adicionarAresta(tituloFilme, ator);
        });
    });

    return grafo;
}


const grafoFilmes = popularGrafo(dadosJSON);

// console.log("=== Grafo de Filmes ===");
// grafoFilmes.mostrarGrafo();

console.log("\n=== Caminho entre Atores ===");
const origem = "Timothée Chalamet";
const destino = "Zendaya";


const resultado = grafoFilmes.encontrarCaminhoMinimo(origem, destino);
if (resultado) {
    console.log(`Caminho mínimo entre ${origem} e ${destino}: ${resultado.caminho.join(' -> ')}`);
    console.log(`Comprimento do caminho mínimo: ${resultado.comprimento}\n`);
}

const relacionamentos = grafoFilmes.encontrarRelacionamentosProximos(origem, destino);
if (relacionamentos.length === 0) {
    console.log(`Não foram encontrados relacionamentos próximos entre ${origem} e ${destino} com um comprimento máximo de 6 arestas.\n`);
} else {
    console.log(`Relacionamentos mais próximos entre ${origem} e ${destino} com um comprimento máximo de 6 arestas:`);
    relacionamentos.forEach(caminho => {
        console.log(caminho.join(' -> '));
    });
}