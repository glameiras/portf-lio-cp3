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

// Formulário demonstrativo: não envia nem persiste dados pessoais.
const formulario = document.querySelector('#contato');
if (formulario) {
  const feedback = document.querySelector('#form-feedback');
  const campos = ['nome', 'email', 'assunto', 'mensagem'];
  function validar(campo) {
    const elemento = formulario.elements[campo];
    const valor = elemento.value.trim();
    let erro = '';
    if (!valor) erro = 'Preencha este campo.';
    else if (campo === 'nome' && valor.length < 2) erro = 'Informe um nome com pelo menos 2 caracteres.';
    else if (campo === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) erro = 'Informe um e-mail válido, como voce@exemplo.com.';
    else if (campo === 'mensagem' && valor.length < 10) erro = 'Escreva uma mensagem com pelo menos 10 caracteres.';
    else if (elemento.maxLength > 0 && valor.length > elemento.maxLength) erro = `Use até ${elemento.maxLength} caracteres.`;
    document.querySelector(`#erro-${campo}`).textContent = erro;
    elemento.setAttribute('aria-invalid', String(Boolean(erro)));
    return !erro;
  }
  campos.forEach((campo) => {
    const elemento = formulario.elements[campo];
    elemento.addEventListener('blur', () => validar(campo));
    elemento.addEventListener('input', () => {
      feedback.textContent = '';
      feedback.className = '';
      if (elemento.getAttribute('aria-invalid') === 'true') validar(campo);
    });
  });
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const resultados = campos.map(validar);
    if (resultados.every(Boolean)) {
      feedback.className = 'success';
      feedback.textContent = 'Dados validados com sucesso! Esta é uma demonstração: nenhuma mensagem foi enviada ou salva.';
    } else {
      feedback.className = 'failure';
      feedback.textContent = 'Revise os campos indicados antes de continuar.';
      formulario.elements[campos[resultados.indexOf(false)]].focus();
    }
  });
}

// Som sintetizado localmente, sempre iniciado por uma ação do visitante.
const botaoSom = document.querySelector('#som');
if (botaoSom) {
  botaoSom.addEventListener('click', async () => {
    const status = document.querySelector('#som-status');
    let contexto;
    botaoSom.disabled = true;
    try {
      const ContextoAudio = window.AudioContext || window.webkitAudioContext;
      if (!ContextoAudio) throw new Error('Áudio indisponível');
      contexto = new ContextoAudio();
      await contexto.resume();
      status.textContent = 'Reproduzindo sequência sonora…';
      const inicio = contexto.currentTime;
      [261.63, 329.63, 392, 523.25].forEach((frequencia, i) => {
        const oscilador = contexto.createOscillator();
        const volume = contexto.createGain();
        const momento = inicio + i * 0.45;
        oscilador.frequency.value = frequencia;
        volume.gain.setValueAtTime(0, momento);
        volume.gain.linearRampToValueAtTime(0.12, momento + 0.04);
        volume.gain.exponentialRampToValueAtTime(0.001, momento + 0.4);
        oscilador.connect(volume);
        volume.connect(contexto.destination);
        oscilador.start(momento);
        oscilador.stop(momento + 0.43);
        if (i === 3) oscilador.onended = async () => {
          await contexto.close();
          botaoSom.disabled = false;
          status.textContent = 'Reprodução concluída. Você pode ouvir novamente.';
        };
      });
    } catch {
      if (contexto && contexto.state !== 'closed') await contexto.close();
      botaoSom.disabled = false;
      status.textContent = 'Não foi possível reproduzir o áudio neste navegador. Tente novamente em um navegador atualizado.';
    }
  });
}
