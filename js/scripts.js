'use strict';

// A mesma chave é compartilhada por todas as páginas deste portfólio.
const CHAVE_TEMA = 'portfolio-gustavo-tema';
const raiz = document.documentElement;
const botaoTema = document.querySelector('#tema');
const avisoStorage = document.querySelector('#storage-status');

function aplicarTema(tema) {
  raiz.dataset.tema = tema;
  const claro = tema === 'claro';
  botaoTema.textContent = claro ? 'Tema escuro ◑' : 'Tema claro ◐';
  botaoTema.setAttribute('aria-pressed', String(claro));
  botaoTema.setAttribute('aria-label', claro ? 'Ativar tema escuro' : 'Ativar tema claro');
  desenharGrafico();
}

// Modo privado ou configurações do navegador podem bloquear o armazenamento.
function avisarArmazenamento() {
  avisoStorage.textContent = 'Seu navegador bloqueou o armazenamento. O tema funciona nesta página, mas poderá não ser lembrado.';
}
let temaInicial = 'escuro';
try {
  const salvo = localStorage.getItem(CHAVE_TEMA);
  if (salvo === 'claro' || salvo === 'escuro') temaInicial = salvo;
} catch {
  avisarArmazenamento();
}
aplicarTema(temaInicial);

botaoTema.addEventListener('click', () => {
  const tema = raiz.dataset.tema === 'claro' ? 'escuro' : 'claro';
  aplicarTema(tema);
  try {
    localStorage.setItem(CHAVE_TEMA, tema);
  } catch {
    avisarArmazenamento();
  }
});

// Mantém outras abas abertas sincronizadas com a preferência salva.
window.addEventListener('storage', (evento) => {
  if (evento.key === CHAVE_TEMA || evento.key === null) {
    aplicarTema(evento.newValue === 'claro' ? 'claro' : 'escuro');
  }
});

// Renderização acessível complementar: a tabela HTML contém os mesmos dados.
function desenharGrafico() {
  const canvas = document.querySelector('#grafico');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const estilos = getComputedStyle(raiz);
  const texto = estilos.getPropertyValue('--text').trim();
  const cores = ['#75a94d', '#509c89', '#9a81d5', '#d7a34e'];
  const valores = [3, 3, 4, 2];
  const nomes = ['HTML', 'CSS', 'JavaScript', 'Git / GitHub'];
  ctx.clearRect(0, 0, 520, 280);
  let inicio = -Math.PI / 2;
  valores.forEach((valor, i) => {
    const fim = inicio + valor / 12 * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(135, 140, 88, inicio, fim);
    ctx.lineWidth = 35;
    ctx.strokeStyle = cores[i];
    ctx.stroke();
    inicio = fim;
    ctx.fillStyle = cores[i];
    ctx.fillRect(275, 60 + i * 45, 14, 14);
    ctx.fillStyle = texto;
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${nomes[i]} · ${valor} h`, 300, 73 + i * 45);
  });
  ctx.fillStyle = texto;
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('12 h', 135, 143);
  ctx.font = '13px Arial';
  ctx.fillText('por semana', 135, 166);
}
