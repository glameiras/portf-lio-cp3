// Testes sem dependências: node testes/verificar.js
// Simulam DOM/storage. Não substituem a conferência visual no navegador.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'js/scripts.js'), 'utf8');
const storage = new Map();
function iniciar(comFormulario = false, bloqueado = false) {
  function elemento() {
    return { value: '', dataset: {}, attrs: {}, events: {}, textContent: '', maxLength: -1,
      setAttribute(k, v) { this.attrs[k] = v; }, getAttribute(k) { return this.attrs[k]; },
      addEventListener(k, v) { this.events[k] = v; }, focus() { this.focused = true; } };
  }
  const elements = { '#tema': elemento(), '#storage-status': elemento() };
  if (comFormulario) {
    elements['#contato'] = elemento();
    elements['#contato'].elements = {};
    elements['#form-feedback'] = elemento();
    for (const nome of ['nome', 'email', 'assunto', 'mensagem']) {
      elements['#contato'].elements[nome] = elemento();
      elements[`#erro-${nome}`] = elemento();
    }
  }
  const document = { documentElement: elemento(), querySelector: s => elements[s] || null };
  const localStorage = {
    getItem(k) { if (bloqueado) throw Error(); return storage.get(k) || null; },
    setItem(k, v) { if (bloqueado) throw Error(); storage.set(k, v); }
  };
  const context = { document, localStorage, window: { addEventListener() {} } };
  vm.runInNewContext(script, context);
  return { document, elements };
}
let a = iniciar();
assert.equal(a.document.documentElement.dataset.tema, 'escuro');
a.elements['#tema'].events.click();
assert.equal(storage.get('portfolio-gustavo-tema'), 'claro');
const paginas = ['index', 'curriculo', 'formulario', 'multimidia', 'graficos'];
for (const pagina of paginas) {
  const html = fs.readFileSync(path.join(root, `${pagina}.html`), 'utf8');
  assert.ok(html.includes('src="js/scripts.js"'));
  assert.ok(html.includes('href="css/estilos.css"'));
  for (const destino of paginas) assert.ok(html.includes(`href="${destino}.html"`));
  const recarga = iniciar(pagina === 'formulario');
  assert.equal(recarga.document.documentElement.dataset.tema, 'claro');
}
a = iniciar(false, true);
a.elements['#tema'].events.click();
assert.ok(a.elements['#storage-status'].textContent.includes('bloqueou'));
a = iniciar(true);
const form = a.elements['#contato'];
const enviar = () => form.events.submit({ preventDefault() {} });
enviar();
assert.equal(a.elements['#form-feedback'].className, 'failure');
assert.equal(form.elements.nome.focused, true);
Object.assign(form.elements.nome, {value:'Gustavo'});
Object.assign(form.elements.email, {value:'invalido'});
Object.assign(form.elements.assunto, {value:'Projeto acadêmico'});
Object.assign(form.elements.mensagem, {value:'Uma mensagem de teste.'});
enviar();
assert.equal(form.elements.email.attrs['aria-invalid'], 'true');
form.elements.email.value = 'teste@example.com';
enviar();
assert.equal(a.elements['#form-feedback'].className, 'success');
assert.ok(a.elements['#form-feedback'].textContent.includes('nenhuma mensagem foi enviada'));
form.elements.nome.value = '   ';
enviar();
assert.equal(a.elements['#form-feedback'].className, 'failure');
assert.deepEqual([...storage.keys()], ['portfolio-gustavo-tema']);
console.log('OK: navegação nas 5 páginas, recursos compartilhados, persistência simulada, storage bloqueado e validação do formulário.');
