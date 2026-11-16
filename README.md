# Gustavo Lameiras - Portfólio CP4

Versão final do projeto individual de Desenvolvimento Front-End para Web. Autor: **Gustavo Lameiras**, estudante de Análise e Desenvolvimento de Sistemas.

- Site: https://glameiras.github.io/portf-lio-cp3/
- Repositório: https://github.com/glameiras/portf-lio-cp3
- Entrega final: tag `cp4-entrega`; a tag `cp3-entrega` permanece preservada.
- Prazo: 17/11/2026.

## Páginas

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Apresentação, navegação e cards com grid Bootstrap |
| `curriculo.html` | Formação, experiência e conhecimentos iniciais |
| `formulario.html` | Formulário demonstrativo com validação e feedback |
| `multimidia.html` | Imagem SVG com descrição e áudio iniciado pelo visitante |
| `graficos.html` | SVG, canvas e tabela equivalente com dados fictícios |

## Evolução e decisões

O histórico registra a construção da estrutura, das cinco páginas, da validação e do tema persistente. O CP3 já reunia HTML, CSS e JavaScript com `localStorage`. O CP4 preserva essas funcionalidades e acrescenta Bootstrap, ajustes finais de acessibilidade/responsividade, testes de navegador e documentação da apresentação. Consulte `git log --graph --oneline --all` para os commits reais; não foram inventadas contribuições ou datas de etapas anteriores.

A identidade escura/verde e a opção clara continuam no CSS próprio. A separação entre HTML, CSS e JavaScript facilita estudar e manter o projeto. Não há framework JavaScript nem backend.

## Bootstrap: onde e por quê

Usamos **Bootstrap 5.3.8**, somente a distribuição oficial de grid, em `css/vendor/bootstrap-grid.min.css`, carregada antes do CSS próprio. A cópia local evita depender de uma CDN durante a demonstração. Licença MIT e créditos preservados no arquivo distribuído.

Na seção de cards da página inicial:

- `row` organiza a linha flexível.
- `g-3` define espaçamento entre as colunas.
- `col-12` usa a largura disponível no celular.
- `col-md-4` coloca três colunas a partir de 768 px.

São classes efetivamente usadas para layout, não apenas nomes adicionados sem função. O restante do visual permanece personalizado. Não precisamos do JavaScript do Bootstrap porque não usamos componentes interativos da biblioteca.

Fonte: https://getbootstrap.com/docs/5.3/layout/grid/

## JavaScript e localStorage

O botão do cabeçalho altera o atributo `data-tema` do HTML e salva `claro` ou `escuro` na chave `portfolio-gustavo-tema`. Ao abrir uma página, `getItem()` recupera a escolha; ao alternar, `setItem()` salva. `try/catch` trata bloqueios do armazenamento: a troca continua na página atual com um aviso. O evento `storage` sincroniza outras abas da mesma origem.

A preferência sobrevive ao F5 e à navegação. Localhost e GitHub Pages têm armazenamentos distintos. **Nenhum dado pessoal do formulário é salvo.**

Demonstração: alterne o tema, confira a chave em DevTools > Application > Local Storage, pressione F5 e abra outra página.

## Formulário e multimídia

Nome com pelo menos dois caracteres, e-mail válido, assunto e mensagem com pelo menos dez caracteres. Espaços não contam. Os erros aparecem junto aos campos, com `aria-invalid` e foco no primeiro erro. O sucesso informa claramente que nada foi enviado ou armazenado.

A Web Audio API produz uma sequência curta após clicar; não há autoplay. O SVG possui texto alternativo. Gráficos são ilustrativos, com descrição acessível e tabela equivalente; não representam domínio ou horas reais do autor.

## Acessibilidade e responsividade

- Idioma pt-BR, estrutura semântica, títulos, labels e link de salto ao conteúdo.
- Foco visível em controles; navegação e tema operáveis pelo teclado.
- Mensagens de estado e erros textuais, sem depender só de cores.
- Bordas dos campos reforçadas com a cor de texto secundário, em ambos os temas.
- Cores claras/escuras próprias, redução de movimento respeitada e imagem responsiva.
- Quebra de linhas no código ilustrativo e colunas adaptáveis para evitar transbordamento.
- Dados do canvas também disponíveis na tabela HTML.

Registro da revisão: [docs/VALIDACAO_CP4.md](docs/VALIDACAO_CP4.md).

## Executar e testar

Abra a pasta no VS Code e use Live Server, ou execute:

```bash
python -m http.server 8000
```

Acesse http://localhost:8000. O site não precisa de npm nem de build para funcionar.

```bash
node testes/verificar.js
```

Esse teste cobre navegação/recursos e lógica com DOM simulado. A workflow **Validar portfólio CP4** executa testes reais em Chromium com Playwright: cinco páginas, temas, persistência, formulário, áudio, canvas, teclado e larguras de celular/desktop. Dependências são instaladas somente no CI. Confira o resultado em Actions; o teste não substitui revisão com leitor de tela ou dispositivos físicos.

## Publicação e entrega

O repositório existente `portf-lio-cp3` permanece com esse nome para preservar a URL. GitHub Pages publica a branch `main`, raiz. A tag anotada `cp4-entrega` identifica a versão final validada; não altera `cp3-entrega`.

No Blackboard, enviar link do site, link do repositório com a tag e **vídeo com sua voz de 1min30 a 2min30**, mostrando todas as páginas, a feature com persistência após F5, evolução, decisões, Bootstrap e acessibilidade. O vídeo precisa mostrar o site publicado funcionando. O enunciado informa que, sem vídeo, todo o trabalho individual é zerado.

**Pendente do aluno:** estudar/revisar o código, ensaiar, gravar e disponibilizar o vídeo e fazer o envio.

## Créditos

Projeto preparado com assistência de IA na geração/revisão de código, documentação e testes. O aluno deve verificar, compreender e adaptar o material e explicar esse uso no vídeo, conforme o enunciado. Bootstrap © The Bootstrap Authors, licença MIT. Ilustração SVG e som gerado fazem parte dos recursos do projeto.
