// Classe Grafo
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
      console.log(`${vertice} -> ${adjacentes.join(", ")}`);
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
      const comprimento = caminho.length;
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
  dados.forEach((filme) => {
    const tituloFilme = filme.title;
    // Adicionamos o título do filme como um vértice no grafo.
    grafo.adicionarVertice(tituloFilme);

    // Iteramos sobre o elenco do filme.
    filme.cast.forEach((ator) => {
      // Adicionamos cada ator como um vértice no grafo, se ainda não existir.
      grafo.adicionarVertice(ator);
      // Criamos uma aresta entre o filme e o ator.
      grafo.adicionarAresta(tituloFilme, ator);
    });
  });

  return grafo;
}

// Função para buscar atores e exibir os resultados na página
async function buscarAtores() {
  // Obter referências aos elementos HTML
  let atorOrigemInput = document.querySelector("#atorOrigem");
  let atorDestinoInput = document.querySelector("#atorDestino");
  let caminhoP = document.querySelector("#caminho p");
  let comprimentoP = document.querySelector("#comprimento p");
  let relacionamentosP = document.querySelector("#relacionamentos p");

  // Obter os nomes dos atores de origem e destino
  let origem = atorOrigemInput.value;
  let destino = atorDestinoInput.value;

  // Verificar se os campos de entrada estão preenchidos
  if (!origem || !destino) {
    alert("Por favor, preencha os dois atores.");
    return;
  }

  // Obter os dados JSON usando fetch
  try {
    const resposta = await fetch("./latest_movies.json");
    const dadosJSON = await resposta.json();

    // Popular o grafo com os dados JSON
    const grafoFilmes = popularGrafo(dadosJSON);

    // Encontrar o caminho mínimo entre os atores de origem e destino
    const resultadoCaminho = grafoFilmes.encontrarCaminhoMinimo(
      origem,
      destino
    );
    if (resultadoCaminho) {
      caminhoP.textContent = `${origem} e ${destino}: ${resultadoCaminho.caminho.join(
        " -> "
      )}`;
      comprimentoP.textContent = `Comprimento do caminho mínimo: ${resultadoCaminho.comprimento}`;
    } else {
      caminhoP.textContent = `Não foi encontrado um caminho entre ${origem} e ${destino}.`;
      comprimentoP.textContent = "";
    }

    // Encontrar os relacionamentos próximos entre os atores de origem e destino
    const relacionamentos = grafoFilmes.encontrarRelacionamentosProximos(
      origem,
      destino
    );
    if (relacionamentos.length === 0) {
      relacionamentosP.innerHTML = `<br> Não foram encontrados relacionamentos próximos entre ${origem} e ${destino} com um comprimento máximo de 6 arestas.`;
    } else {
      let relacionamentosTexto =
        origem + " e " + destino + " com um comprimento máximo de 6 arestas:<br><br>";
      relacionamentos.forEach((caminho) => {
        relacionamentosTexto += caminho.join(" -> ") + "<br><br>";
      });
      relacionamentosP.innerHTML = relacionamentosTexto;
    }
  } catch (erro) {
    console.error("Erro ao obter os dados JSON:", erro);
    alert(
      "Ocorreu um erro ao buscar os dados. Por favor, tente novamente mais tarde."
    );
  }
}

// Evento de clique do botão "Buscar"
document.querySelector("#btnBuscar").addEventListener("click", buscarAtores);
let title = document.getElementById("title");
let formBox = document.getElementById("formBox");
let inputGroup = document.getElementById("inputGroup");
let atorField = document.getElementById("atorField");
let atorField2 = document.getElementById("atorField2");
let caminho = document.getElementById("caminho");
let comprimento = document.getElementById("comprimento");
let relacionamentos = document.getElementById("relacionamentos");
let relacionamentosBox = document.getElementById("relacionamentosBox");
let btnBuscar = document.getElementById("btnBuscar");

btnBuscar.onclick = function () {
  let atorOrigemInput = document.querySelector("#atorOrigem");
  let atorDestinoInput = document.querySelector("#atorDestino");
  let origem = atorOrigemInput.value;
  let destino = atorDestinoInput.value;

  if (!origem || !destino) {
    return;
  }

  // Se a origem e o destino estiverem preenchidos, execute o código abaixo
  title.innerHTML = "Resultado";
  formBox.style.height = "800px";
  formBox.style.maxWidth = "600px";
  caminho.style.opacity = "1";
  caminho.style.display = "block";
  comprimento.style.opacity = "1";
  comprimento.style.display = "block";
  relacionamentos.style.opacity = "1";
  relacionamentos.style.display = "block";
  relacionamentosBox.style.height = "250px";
  inputGroup.style.height = "550px";
  btnBuscar.style.marginTop = "15px";
};
