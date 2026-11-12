const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const base = process.env.TEST_URL || 'http://127.0.0.1:8766/';
  const pages = ['index', 'curriculo', 'formulario', 'multimidia', 'graficos'];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });

  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of pages) {
      await page.goto(`${base}${name}.html`);
      for (const theme of ['claro', 'escuro']) {
        if (await page.locator('html').getAttribute('data-tema') !== theme) {
          await page.locator('#tema').click();
        }
        assert.equal(await page.locator('html').getAttribute('data-tema'), theme);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow ${name}/${width}/${theme}`);
        assert.equal(await page.locator('nav a').count(), 5);
        assert.equal(await page.locator('nav a[aria-current="page"]').count(), 1);
        assert.equal(await page.locator('img:not([alt])').count(), 0);
      }
    }
  }

  await page.goto(base);
  await page.locator('#tema').click();
  const saved = await page.locator('html').getAttribute('data-tema');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-tema'), saved);
  assert.equal(await page.evaluate(() => localStorage.getItem('portfolio-gustavo-tema')), saved);
  await page.getByRole('link', {name:'Currículo', exact:true}).click();
  assert.equal(await page.locator('html').getAttribute('data-tema'), saved);
  const second = await context.newPage();
  await second.goto(base);
  await page.locator('#tema').click();
  await second.waitForFunction(expected => document.documentElement.dataset.tema === expected,
    await page.locator('html').getAttribute('data-tema'));

  await page.goto(base + 'formulario.html');
  await page.locator('button[type=submit]').click();
  assert.equal(await page.evaluate(() => document.activeElement.id), 'nome');
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 4);
  await page.locator('#nome').fill('Teste CP4');
  await page.locator('#email').fill('invalido');
  await page.locator('#assunto').selectOption({label:'Projeto acadêmico'});
  await page.locator('#mensagem').fill('Mensagem para teste acadêmico.');
  await page.locator('button[type=submit]').click();
  assert.equal(await page.evaluate(() => document.activeElement.id), 'email');
  await page.locator('#email').fill('teste@example.com');
  await page.locator('button[type=submit]').click();
  assert.match(await page.locator('#form-feedback').innerText(), /sucesso.*nenhuma mensagem foi enviada/);
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), ['portfolio-gustavo-tema']);

  await page.goto(base + 'multimidia.html');
  await page.locator('#som').click();
  await page.waitForFunction(() => document.querySelector('#som-status').textContent.includes('concluída'));
  assert(await page.locator('#som').isEnabled());
  await page.goto(base + 'graficos.html');
  assert(await page.locator('canvas').evaluate(canvas => {
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    return data.some((value, index) => index % 4 === 3 && value > 0);
  }));

  await page.goto(base);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.className), 'skip');
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'conteudo');
  await page.locator('#tema').focus();
  const before = await page.locator('html').getAttribute('data-tema');
  await page.keyboard.press('Enter');
  assert.notEqual(await page.locator('html').getAttribute('data-tema'), before);
  assert.equal(await page.locator('#tema').evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
  assert.equal(await page.locator('.portfolio-cards > .col-md-4').count(), 3);
  assert.equal(await page.locator('.portfolio-cards').evaluate(el => getComputedStyle(el).display), 'flex');

  const blocked = await browser.newContext();
  await blocked.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('blocked'); };
    Storage.prototype.setItem = () => { throw new Error('blocked'); };
  });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(base);
  await blockedPage.locator('#tema').click();
  assert.equal(await blockedPage.locator('html').getAttribute('data-tema'), 'claro');
  assert.match(await blockedPage.locator('#storage-status').innerText(), /bloqueou/);
  assert.deepEqual(errors, []);
  console.log('PASS: 5 páginas; 320/375/768/1440 px; 2 temas; F5 e navegação; sincronização de abas; formulário inválido/válido; áudio; canvas; teclado/foco; Bootstrap; storage bloqueado; sem erros JS/HTTP.');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
