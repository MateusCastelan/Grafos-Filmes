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
    const caminho = this.bfs(origem, destino);
    if (caminho) {
      const comprimento = caminho.length;
      return { caminho, comprimento };
    }
    return null;
  }

  encontrarRelacionamentosProximos(origem, destino) {
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

      if (caminhoAtual.length > 6) {
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

function popularGrafo(dados) {
  const grafo = new Grafo();

  dados.forEach((filme) => {
    const tituloFilme = filme.title;
    grafo.adicionarVertice(tituloFilme);

    filme.cast.forEach((ator) => {
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
    if (relacionamentos.length === 0) {
      relacionamentosP.innerHTML = `<br> Não foram encontrados relacionamentos próximos entre ${origem} e ${destino} com um comprimento máximo de 6 arestas.`;
    } else {
      let relacionamentosTexto =
        origem +
        " e " +
        destino +
        " com um comprimento máximo de 6 arestas:<br><br>";
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

  title.innerHTML = "Resultado";
  formBox.style.height = "800px";
  formBox.style.maxWidth = "600px";
  caminho.style.opacity = "1";
  caminho.style.display = "block";
  comprimento.style.opacity = "1";
  comprimento.style.display = "block";
  relacionamentos.style.opacity = "1";
  relacionamentos.style.display = "block";
  relacionamentosBox.style.minHeight = "150px";
  relacionamentosBox.style.height = "fit-content";
  inputGroup.style.height = "550px";
  btnBuscar.style.marginTop = "15px";
};
