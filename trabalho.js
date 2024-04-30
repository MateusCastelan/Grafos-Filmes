// Classe Grafo
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
    // Estrutura para armazenar o menor caminho encontrado.
    let menorCaminho = null;
    // Estrutura para armazenar o comprimento do menor caminho.
    let menorComprimento = Infinity;
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

      // Se o vértice atual for o destino e o comprimento do caminho atual for menor que o menor comprimento encontrado até agora.
      if (verticeAtual === destino && caminhoAtual.length < menorComprimento) {
        menorCaminho = caminhoAtual; // Armazena o menor caminho.
        menorComprimento = caminhoAtual.length; // Atualiza o menor comprimento.
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

    // Se um menor caminho foi encontrado, retorna o caminho e seu comprimento.
    if (menorCaminho) {
      return { caminho: menorCaminho, comprimento: menorComprimento };
    } else {
      // Se não houver caminho entre a origem e o destino.
      console.log(`Não há um caminho entre ${origem} e ${destino}.`);
      return null;
    }
  }

  encontrarRelacionamentosProximos(origem, destino, comprimentoMaximo = Infinity) {
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

      // Se o comprimento do caminho atual for maior que o máximo permitido, paramos a busca.
      if (caminhoAtual.length > comprimentoMaximo) {
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

function popularSelectAtores(dados) {
  const atorOrigemSelect = document.getElementById("atorOrigem");
  const atorDestinoSelect = document.getElementById("atorDestino");

  // Iterar sobre cada filme no JSON
  dados.forEach((filme) => {
    // Iterar sobre o elenco do filme
    filme.cast.forEach((ator) => {
      // Verificar se o ator já foi adicionado como opção
      if (!atorOrigemSelect.querySelector(`option[value="${ator}"]`)) {
        // Adicionar o ator como opção para o ator de origem
        const optionOrigem = document.createElement("option");
        optionOrigem.value = ator;
        optionOrigem.textContent = ator;
        atorOrigemSelect.appendChild(optionOrigem);
      }

      if (!atorDestinoSelect.querySelector(`option[value="${ator}"]`)) {
        // Adicionar o ator como opção para o ator de destino
        const optionDestino = document.createElement("option");
        optionDestino.value = ator;
        optionDestino.textContent = ator;
        atorDestinoSelect.appendChild(optionDestino);
      }
    });
  });
}

async function obterDadosJSON() {
  try {
    const resposta = await fetch("./latest_movies.json");
    const dadosJSON = await resposta.json();
    popularSelectAtores(dadosJSON);
  } catch (erro) {
    console.error("Erro ao obter os dados JSON:", erro);
    alert("Ocorreu um erro ao buscar os dados. Por favor, tente novamente mais tarde.");
  }
}

// Chamar a função para obter os dados JSON e popular os selects
obterDadosJSON();

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

async function buscarAtores() {
  // Obter referências aos elementos HTML
  let atorOrigemInput = document.querySelector("#atorOrigem");
  let atorDestinoInput = document.querySelector("#atorDestino");
  let caminhoP = document.querySelector("#caminho p");
  let comprimentoP = document.querySelector("#comprimento p");
  let relacionamentosP = document.querySelector("#relacionamentos p");
  let relacionamentosP6 = document.querySelector("#relacionamentosBox6");

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

    // Filtrar os relacionamentos com comprimentos menores ou iguais a 6
    const relacionamentosMenorIgualSeis = relacionamentos.filter(caminho => caminho.length <= 6);

    // Exibir os relacionamentos com comprimentos menores ou iguais a 6
    if (relacionamentosMenorIgualSeis.length === 0) {
      relacionamentosP.innerHTML = `<br> Não foram encontrados relacionamentos com comprimentos menores ou iguais a 6 entre ${origem} e ${destino}.`;
    } else {
      let relacionamentosTextoMenorIgualSeis =
        origem + " e " + destino + " com um comprimento máximo de 6 arestas:<br><br>";
      relacionamentosMenorIgualSeis.forEach((caminho) => {
        relacionamentosTextoMenorIgualSeis += caminho.join(" -> ") + "<br><br>";
      });
      relacionamentosP.innerHTML = relacionamentosTextoMenorIgualSeis;
    }

    // Exibir todos os relacionamentos em relacionamentos6
    if (relacionamentos.length === 0) {
      relacionamentosP6.innerHTML = `Não foram encontrados relacionamentos entre ${origem} e ${destino}.`;
    } else {
      let relacionamentosTexto =
        "Todos os relacionamentos entre " + origem + " e " + destino + ":<br><br>";
      relacionamentos.forEach((caminho) => {
        relacionamentosTexto += caminho.join(" -> ") + "<br><br>";
      });
      relacionamentosP6.innerHTML = relacionamentosTexto;
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
let relacionamentos6 = document.getElementById("relacionamentos6");
let relacionamentosBox6 = document.getElementById("relacionamentosBox6");
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
  formBox.style.height = "700px";
  formBox.style.maxWidth = "1200px";
  formBox.style.overflowY = "auto";
  inputGroup.style.height = "750px";
  caminho.style.opacity = "1";
  caminho.style.display = "block";
  comprimento.style.opacity = "1";
  comprimento.style.display = "block";
  relacionamentos.style.opacity = "1";
  relacionamentos.style.display = "block";
  relacionamentosBox.style.height = "150px";
  relacionamentos6.style.opacity = "1";
  relacionamentos6.style.display = "block";
  relacionamentosBox6.style.height = "150px";
  btnBuscar.style.marginTop = "15px";
};
