const cronometroEl = document.getElementById("cronometro");
const btnIniciar = document.getElementById("btn-iniciar");
const btnEncerrar = document.getElementById("btn-encerrar");
const btnHistorico = document.getElementById("btn-historico");
const listaHistorico = document.getElementById("lista-historico");

const nomeTimeA = document.getElementById("nome-time-a").innerText;
const nomeTimeB = document.getElementById("nome-time-b").innerText;
const pontuacaoAEl = document.getElementById("pontuacao-a");
const pontuacaoBEl = document.getElementById("pontuacao-b");

const faltasAEl = document.getElementById("faltas-a");
const faltasBEl = document.getElementById("faltas-b");

let tempo = 5 * 60;
let intervalo = null;

function zerarPlacar() {
  [pontuacaoAEl, pontuacaoBEl].forEach(el => {
    el.children[0].textContent = "0";
    el.children[1].textContent = "0";
  });
}

function atualizarCronometro() {
  const min = String(Math.floor(tempo / 60)).padStart(2, "0");
  const sec = String(tempo % 60).padStart(2, "0");
  cronometroEl.textContent = `${min}:${sec}`;
}

function iniciarCronometro() {
  if (intervalo) return;
  intervalo = setInterval(() => {
    if (tempo > 0) {
      tempo--;
      atualizarCronometro();
    } else {
      encerrarPartida(); // fim do tempo = encerrar
    }
  }, 1000);
}

function pararCronometro() {
  clearInterval(intervalo);
  intervalo = null;
}

function reiniciarCronometro() {
  pararCronometro();
  tempo = 5 * 60;
  atualizarCronometro();
}

function atualizarPontuacao(time, direcao) {
  const el = time === "a" ? pontuacaoAEl : pontuacaoBEl;
  const digitos = [...el.querySelectorAll(".digito")].map((d) =>
    parseInt(d.textContent)
  );
  let valor = digitos[0] * 10 + digitos[1];

  valor += direcao === "mais" ? 1 : -1;
  if (valor < 0) valor = 0;
  if (valor > 99) valor = 99;

  el.children[0].textContent = Math.floor(valor / 10);
  el.children[1].textContent = valor % 10;
}

function salvarHistorico(timeA, timeB, pontosA, pontosB, faltasA, faltasB) {
  const historico = JSON.parse(localStorage.getItem("historicoPartidas")) || [];
  historico.push({
    data: new Date().toLocaleString(),
    timeA,
    timeB,
    pontosA,
    pontosB,
    faltasA,
    faltasB,
  });
  localStorage.setItem("historicoPartidas", JSON.stringify(historico));
}

function exibirHistorico() {
  const historico = JSON.parse(localStorage.getItem("historicoPartidas")) || [];
  listaHistorico.innerHTML = "";

  if (historico.length === 0) {
    listaHistorico.innerHTML = "<li>Nenhuma partida registrada.</li>";
    return;
  }

  historico.forEach((p) => {
    const item = document.createElement("li");
    item.textContent = `${p.data} - ${p.timeA} ${p.pontosA} x ${p.pontosB} ${p.timeB} | Faltas: ${p.faltasA} - ${p.faltasB}`;
    listaHistorico.appendChild(item);
  });
}

function encerrarPartida() {
  pararCronometro();

  const pontosA = [...pontuacaoAEl.querySelectorAll(".digito")]
    .map((d) => d.textContent)
    .join("");
  const pontosB = [...pontuacaoBEl.querySelectorAll(".digito")]
    .map((d) => d.textContent)
    .join("");

  const faltasA = faltasAEl ? faltasAEl.textContent : "0";
  const faltasB = faltasBEl ? faltasBEl.textContent : "0";

  salvarHistorico(nomeTimeA, nomeTimeB, pontosA, pontosB, faltasA, faltasB);

  document.getElementById("popup-encerramento").style.display = "flex";
  reiniciarCronometro();
}

function configurarModais() {
  document.querySelectorAll(".fechar-modal").forEach((btn) =>
    btn.addEventListener("click", () => {
      btn.closest(".modal-container").style.display = "none";
    })
  );

  document.getElementById("btn-info-regras").addEventListener("click", () => {
    document.getElementById("modal-regras").style.display = "flex";
  });

  btnHistorico.addEventListener("click", () => {
    exibirHistorico();
    document.getElementById("modal-historico").style.display = "flex";
  });
}

function configurarBotoesContadores() {
  document.querySelectorAll(".botao").forEach((btn) => {
    btn.addEventListener("click", () => {
      const time = btn.dataset.time;
      const acao = btn.dataset.acao;

      if (time && acao) {
        atualizarPontuacao(time, acao);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarCronometro();
  configurarModais();
  configurarBotoesContadores();

  btnIniciar.addEventListener("click", () => {
    zerarPlacar();
    iniciarCronometro();
  });

  btnEncerrar.addEventListener("click", encerrarPartida);

  document.getElementById("fechar-popup").addEventListener("click", () => {
    document.getElementById("popup-encerramento").style.display = "none";
  });

  const btnApagarUltima = document.getElementById("btn-apagar-ultima");
  btnApagarUltima.addEventListener("click", () => {
    const itens = listaHistorico.getElementsByTagName("li");
    if (itens.length > 0) {
      listaHistorico.removeChild(itens[itens.length - 1]);
    } else {
      alert("Não há partidas para apagar.");
    }
  });
});
