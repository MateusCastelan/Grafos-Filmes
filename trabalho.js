class Grafo {
  constructor() {
    this.listaAdj = new Map();
  }

  adicionarVertice(vertice) {
    if (!this.listaAdj.has(vertice)) {
      this.listaAdj.set(vertice, []);
    }
  }

  adicionarAresta(vertice1, vertice2) {
    this.listaAdj.get(vertice1).push(vertice2);
    this.listaAdj.get(vertice2).push(vertice1);
  }

  mostrarGrafo() {
    for (let [vertice, adjacentes] of this.listaAdj) {
      console.log(`${vertice} -> ${adjacentes.join(", ")}`);
    }
  }

  bfs(origem, destino) {
    const caminho = [];
    const visitados = new Set();
    const fila = [[origem]];

    if (!this.listaAdj.has(origem)) {
      console.log(`O vértice ${origem} não existe no grafo.`);
      return null;
    }

    while (fila.length) {
      const caminhoAtual = fila.shift();
      const verticeAtual = caminhoAtual[caminhoAtual.length - 1];

      if (verticeAtual === destino) {
        return caminhoAtual;
      }

      if (!visitados.has(verticeAtual)) {
        visitados.add(verticeAtual);

        for (const adjacente of this.listaAdj.get(verticeAtual)) {
          const novoCaminho = [...caminhoAtual, adjacente];
          fila.push(novoCaminho);
        }
      }
    }

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
    const relacionamentosProximos = [];
    const visitados = new Set();
    const fila = [[origem]];

    if (!this.listaAdj.has(origem)) {
      console.log(`O vértice ${origem} não existe no grafo.`);
      return relacionamentosProximos;
    }

    while (fila.length) {
      const caminhoAtual = fila.shift();
      const verticeAtual = caminhoAtual[caminhoAtual.length - 1];

      if (caminhoAtual.length > comprimentoMaximo) {
        break;
      }

      if (verticeAtual === destino) {
        relacionamentosProximos.push(caminhoAtual);
        continue;
      }

      if (!visitados.has(verticeAtual)) {
        visitados.add(verticeAtual);

        for (const adjacente of this.listaAdj.get(verticeAtual)) {
          const novoCaminho = [...caminhoAtual, adjacente];
          fila.push(novoCaminho);
        }
      }
    }

    return relacionamentosProximos;
  }
}

function popularSelectAtores(dados) {
  const atorOrigemSelect = document.getElementById("atorOrigem");
  const atorDestinoSelect = document.getElementById("atorDestino");

  dados.forEach((filme) => {
    filme.cast.forEach((ator) => {
      if (!atorOrigemSelect.querySelector(`option[value="${ator}"]`)) {
        const optionOrigem = document.createElement("option");
        optionOrigem.value = ator;
        optionOrigem.textContent = ator;
        atorOrigemSelect.appendChild(optionOrigem);
      }

      if (!atorDestinoSelect.querySelector(`option[value="${ator}"]`)) {
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

obterDadosJSON();

function popularGrafo(dados) {
  const grafo = new Grafo();

  dados.forEach((filme) => {
    const tituloFilme = filme.title;
    grafo.adicionarVertice(tituloFilme);

    filme.cast.forEach((ator) => {
      grafo.adicionarVertice(ator);
      grafo.adicionarAresta(tituloFilme, ator);
    });
  });

  return grafo;
}

async function buscarAtores() {
  let atorOrigemInput = document.querySelector("#atorOrigem");
  let atorDestinoInput = document.querySelector("#atorDestino");
  let caminhoP = document.querySelector("#caminho p");
  let comprimentoP = document.querySelector("#comprimento p");
  let relacionamentosP = document.querySelector("#relacionamentos p");
  let relacionamentosP6 = document.querySelector("#relacionamentosBox6");

  let origem = atorOrigemInput.value;
  let destino = atorDestinoInput.value;

  if (!origem || !destino) {
    alert("Por favor, preencha os dois atores.");
    return;
  }

  try {
    const resposta = await fetch("./latest_movies.json");
    const dadosJSON = await resposta.json();

    const grafoFilmes = popularGrafo(dadosJSON);

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

    const relacionamentos = grafoFilmes.encontrarRelacionamentosProximos(
      origem,
      destino
    );

    const relacionamentosMenorIgualSeis = relacionamentos.filter(caminho => caminho.length <= 6);

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
