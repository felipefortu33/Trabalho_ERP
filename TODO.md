# TODO do ERP

Backlog criado a partir da analise do estado atual do repositorio. A ordem considera risco, impacto no usuario e dependencias entre tarefas.

## Estado atual observado

- O sistema possui tres superficies: API Node/Express, frontend React/Vite e aplicativo Expo/React Native.
- O backend ja separa rotas, controllers, middleware de autenticacao e acesso ao MySQL.
- Clientes e produtos usam autenticacao por rota; dashboard e financeiro usam autenticacao no registro da rota.
- A criacao das tabelas acontece no boot da API, sem uma estrategia de migrations versionadas.
- O frontend e o mobile usam URLs de API fixas em arquivos diferentes.
- O backend nao possui testes configurados de fato (`npm test` sempre falha com a mensagem padrao).
- Ha dependencias que nao combinam com o frontend atual, como `pinia` e `vue-router` em um projeto React.

## Prioridade P0 - corrigir antes de evoluir

- [x] **P0.1 Configuracao segura de segredos**
  - Remover o fallback `seu_segredo` do JWT e falhar explicitamente quando `SECRET_KEY` nao existir.
  - Remover credenciais padrao do banco em ambientes nao locais.
  - Criar `.env.example` para backend, frontend e mobile, sem incluir valores reais.
  - Confirmar que `.env`, dumps e credenciais nao entram no Git.

- [x] **P0.2 Validacao e tratamento de erros da API**
  - [x] Adicionar validacao de body, query e parametros nas rotas de auth, clientes, produtos, pedidos e financeiro.
  - [x] Padronizar respostas de erro com status, codigo e mensagem segura em todos os controllers.
  - [x] Adicionar middleware global de erro e evitar expor detalhes do MySQL em erros nao tratados.
  - [x] Validar o formato `Bearer <token>` antes de tentar verificar o JWT.

- [x] **P0.3 Proteger uploads**
  - [x] Definir limite de tamanho, tipos MIME permitidos e extensoes aceitas no `multer`.
  - [x] Rejeitar arquivos invalidos com resposta padronizada.
  - Imagens ficam no filesystem local, com URL relativa persistida no banco; storage externo deve ser avaliado antes de escalar horizontalmente.

- [x] **P0.4 Criar uma base minima de testes**
  - [x] Configurar testes de API para register/login, autenticacao, CRUD de clientes e produtos.
  - [x] Cobrir token ausente, token invalido, payload invalido e recurso inexistente.
  - [x] Fazer `npm test` executar testes reais.
  - [x] Incluir comandos de teste e setup no README.
  - [x] Cobrir os validadores de entrada de auth, clientes, produtos, pedidos e financeiro.
  - [x] Cobrir respostas HTTP de login invalido, rota protegida e rota inexistente.
  - [x] Cobrir payloads invalidos em rotas protegidas de clientes, pedidos e financeiro.

## Prioridade P1 - confiabilidade e dominio

- [ ] **P1.1 Organizar banco e migrations**
  - [x] Substituir `createTables.js` como mecanismo principal por migrations versionadas.
  - [x] Adicionar indices para emails, buscas, chaves estrangeiras e campos usados em filtros.
  - [x] Definir `NOT NULL`, `CHECK` e regras de exclusao para pedidos, itens e financeiro.
  - Revisar duplicidade entre `contas_receber`, `fluxo_caixa`, `transacoes` e `receitas`.

- [ ] **P1.2 Regras de pedidos e estoque**
  - [x] Implementar transacao SQL para criar pedido, itens e baixa de estoque.
  - [x] Impedir estoque negativo e dupla baixa quando o pedido for atualizado.
  - [ ] Validar transicoes de status e registrar data/historico da alteracao.
  - Calcular totais no backend, sem confiar em valores enviados pelo cliente.

- [ ] **P1.3 Autorizacao e ciclo de sessao**
  - Definir perfis e permissoes, mesmo que inicialmente existam apenas administrador e operador.
  - Implementar expiracao, logout e tratamento global de `401`/`403` nos clientes.
  - Nao armazenar token de forma insegura no mobile; avaliar armazenamento seguro do dispositivo.

- [ ] **P1.4 Observabilidade e operacao**
  - Adicionar health check que valide processo e banco separadamente.
  - Usar logger estruturado com request id e sem registrar senha, token ou dados sensiveis.
  - Configurar encerramento gracioso, timeout de banco e tratamento de rejeicoes nao tratadas.
  - Adicionar `helmet`, rate limit para auth e CORS por ambiente/origem permitida.

- [ ] **P1.5 Contrato da API**
  - Atualizar Swagger com schemas, exemplos, erros e seguranca em todos os endpoints.
  - Definir convencao de paginacao, filtros, ordenacao e formato de datas.
  - Gerar ou manter um cliente compartilhado para reduzir divergencias entre web e mobile.

## Prioridade P2 - experiencia e produtividade

- [ ] **P2.1 Configuracao dos clientes**
  - Trocar URLs fixas por variaveis de ambiente no Vite e no Expo.
  - Criar uma camada de sessao compartilhada por cliente para login, usuario atual e expiracao.
  - Centralizar estados de carregamento, vazio, erro e sucesso.

- [ ] **P2.2 Frontend web**
  - [x] Instalar dependencias declaradas e corrigir erros e warnings do lint.
  - [x] Garantir que o build de producao seja concluido.
  - Revisar a duplicacao de layout e rotas protegidas em `App.jsx` usando um layout de rota.
  - Corrigir a identidade visual provisoria do `Topbar` e alinhar logo, navegacao e responsividade.
  - Implementar acessibilidade: foco, labels, teclado, contraste e mensagens de validacao.
  - Remover dependencias sem uso (`pinia`, `vue-router`) ou documentar por que permanecem.

- [ ] **P2.3 Aplicativo mobile**
  - Substituir busca/notificacoes aparentes no `Topbar` por fluxos funcionais ou remover os controles.
  - Revisar telas para uso offline, retry e feedback de conectividade.
  - Validar layout em telas pequenas, tablets e Android/iOS.

- [ ] **P2.4 Performance e dados**
  - Adicionar paginacao no backend e listas virtualizadas nos clientes.
  - Debounce nas buscas e cancelamento de requests obsoletas.
  - Definir cache/invalidation para dashboard, produtos e clientes.

## Prioridade P3 - evolucao do produto

- [ ] **P3.1 Financeiro completo**
  - Fechar o fluxo de contas a pagar/receber, conciliacao e fluxo de caixa.
  - Adicionar filtros por periodo, status, categoria e forma de pagamento.
  - Criar exportacao CSV/PDF com permissao e auditoria.

- [ ] **P3.2 Auditoria e historico**
  - Registrar quem criou, alterou ou excluiu dados importantes.
  - Criar historico de pedidos, estoque e movimentacoes financeiras.

- [ ] **P3.3 Entrega e qualidade continua**
  - Criar pipeline CI para lint, testes, build do frontend e verificacao das dependencias.
  - Adicionar testes de componente e fluxos E2E para login, cliente, produto e pedido.
  - [x] Configurar analise de vulnerabilidades e atualizar dependencias diretas vulneraveis do backend.
  - [ ] Investigar vulnerabilidades transitivas restantes reportadas pelo `npm audit` local.
  - Documentar setup local, variaveis, banco, comandos e processo de release.

## Primeira sequencia recomendada

1. Configuracao de segredos e variaveis de ambiente.
2. Validacao e middleware global de erros.
3. Limites e validacao de uploads.
4. Testes de autenticacao e CRUD principal.
5. Migrations e revisao do modelo financeiro.
6. Transacao de pedido com baixa de estoque.
7. Health check, logs, rate limit e CORS.
8. Padronizacao de sessao e tratamento de erros no web/mobile.

## Criterio de pronto para cada item

- [ ] O comportamento esperado esta descrito em uma issue ou caso de uso.
- [ ] Existe teste automatizado ou uma verificacao manual reproduzivel.
- [ ] A documentacao e as variaveis de ambiente foram atualizadas.
- [ ] O item foi validado sem quebrar web, mobile ou API.
- [ ] A alteracao foi revisada antes de entrar em `main`.