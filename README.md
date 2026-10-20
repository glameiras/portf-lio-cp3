# Gustavo Lameiras — Portfólio CP3

Projeto acadêmico de portfólio com cinco páginas em HTML, CSS e JavaScript puro.

## Autor
Gustavo Lameiras — estudante de Análise e Desenvolvimento de Sistemas.

## Páginas
- `index.html`: apresentação e caminhos do portfólio.
- `curriculo.html`: formação, conhecimentos e experiência profissional.
- `formulario.html`: contato demonstrativo com validação.
- `multimidia.html`: ilustração SVG e experiência sonora gerada no navegador.
- `graficos.html`: gráfico SVG, gráfico em canvas e tabela de dados ilustrativos.

## Executar
Abra a pasta com o VS Code e use Live Server, ou execute `python -m http.server 8000` e acesse `http://localhost:8000`.

CSS compartilhado: `css/estilos.css`. JavaScript compartilhado: `js/scripts.js`.

## Funcionalidades

### Tema claro/escuro com persistência
O botão no cabeçalho alterna a paleta em todas as cinco páginas. O JavaScript usa `localStorage.getItem()` ao carregar e `localStorage.setItem()` ao alternar. A chave `portfolio-gustavo-tema` recebe `claro` ou `escuro`. A escolha permanece após recarregar e navegar entre páginas da mesma origem. Abas abertas são sincronizadas pelo evento `storage`.

Se o navegador bloquear o armazenamento, a troca continua funcionando na página atual e um aviso explica a limitação. Nenhum dado pessoal do formulário é persistido.

Como testar:
1. Abra `index.html` por um servidor local ou pela URL publicada.
2. Alterne o tema no cabeçalho e recarregue.
3. Navegue pelas outras quatro páginas: a preferência deve permanecer.
4. Em DevTools → Application → Local Storage, confira `portfolio-gustavo-tema`.
5. Troque novamente e confira o valor. O armazenamento é separado por origem; localhost e GitHub Pages não compartilham a preferência.

### Formulário
Nome (mínimo de 2 caracteres), e-mail válido, assunto e mensagem (mínimo de 10 caracteres) são obrigatórios. Espaços em branco não contam como conteúdo. Os erros aparecem próximos aos campos, com `aria-invalid`, e o foco vai ao primeiro erro ao validar. A confirmação informa explicitamente que nada foi enviado. Este site estático não possui backend de envio.

### Multimídia e gráficos
- Ilustração original em SVG com descrição alternativa.
- Sequência sonora com Web Audio API, iniciada pelo visitante.
- Gráficos em SVG e canvas com dados fictícios, descrições acessíveis e tabela equivalente.
- Sem bibliotecas externas, rastreadores, imagens remotas ou dependências para executar o site.

## Estrutura
```text
portfolio-cp3/
├── index.html
├── curriculo.html
├── formulario.html
├── multimidia.html
├── graficos.html
├── css/estilos.css
├── js/scripts.js
├── assets/favicon.svg
├── assets/workspace.svg
├── testes/verificar.js
├── .gitignore
├── .nojekyll
└── README.md
```

## Testes executados na preparação
`node testes/verificar.js` verifica a presença de todos os links do menu, os recursos compartilhados, a persistência em contextos simulados de recarga, o tratamento de armazenamento bloqueado e os caminhos de erro e sucesso do formulário. Também foram verificados sintaxe JavaScript, fechamento de elementos HTML, IDs únicos e existência dos arquivos referenciados.

Limite: estes são testes de código e DOM simulado. A renderização, o áudio no navegador e a URL pública ainda precisam de conferência manual após o deploy. Não foi realizado teste em janela anônima nesta preparação.

## Histórico Git
O projeto foi desenvolvido com commits por etapa. A feature de tema foi implementada na branch `feature/tema-escuro`, integrada com merge à `main`. A tag anotada `cp3-entrega` marca a versão preparada para entrega.

```bash
git log --graph --oneline --all
git show cp3-entrega --stat
```

## Publicar no GitHub Pages
1. Crie um repositório público chamado `portfolio-cp3` na conta `glameiras`, **sem** adicionar README, licença ou gitignore pelo GitHub.
2. Se recebeu o pacote ZIP, restaure o histórico com o arquivo `restaurar-historico.bat`, conforme o guia externo. Não faça um único commit pelo upload de arquivos no site do GitHub.
3. No terminal, dentro da pasta do projeto com o histórico restaurado:
```bash
git remote add origin https://github.com/glameiras/portfolio-cp3.git
git push -u origin main
git push origin feature/tema-escuro
git push origin cp3-entrega
```
4. Abra Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` → `/ (root)` → Save.
5. Aguarde a publicação e use o endereço informado pelo próprio GitHub. Endereço esperado para esse nome: `https://glameiras.github.io/portfolio-cp3/` (não significa que já esteja publicado).
6. Se houver a opção, mantenha Enforce HTTPS ativado.

## Checklist antes de enviar no Blackboard
- [ ] Repositório público acessível sem login, com commits descritivos.
- [ ] Branch `main` e tag `cp3-entrega` enviadas.
- [ ] GitHub Pages com deploy concluído e HTTPS.
- [ ] Em janela anônima, abrir a página inicial e navegar pelo menu nas cinco páginas.
- [ ] Alternar o tema, recarregar e navegar para conferir a persistência.
- [ ] Testar formulário vazio, e-mail inválido e dados válidos.
- [ ] Reproduzir o áudio e conferir gráficos, tabela e layout no celular.
- [ ] Conferir que o site publicado corresponde ao commit da tag.
- [ ] Enviar o link do repositório e a URL publicada no Blackboard.

Se precisar corrigir algo depois da tag, faça um novo commit e envie para `main`. Antes da entrega definitiva, mova a tag apenas de forma consciente e sincronize a versão publicada; não altere silenciosamente uma versão já avaliada.

## Créditos
Conteúdo e código preparados com assistência de IA para estudo e revisão do aluno. Leia e compreenda o código antes da apresentação e siga as regras de autoria da disciplina. Dados dos gráficos são ilustrativos. O currículo evita atribuir domínio avançado de tecnologias ao autor.
