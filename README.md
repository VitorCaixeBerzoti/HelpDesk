# HelpDesk

Sistema de suporte desenvolvido por **Vitor Caixe**, com React, Express, PostgreSQL e Prisma. Usuários abrem e acompanham solicitações; técnicos e administradores atendem os chamados. A interface inclui quadro por status e temas claro e escuro.

O projeto agora possui uma única instalação de dependências e um único arquivo de configuração na raiz. A API e a interface são entregues pelo mesmo servidor no Docker.

## Subir tudo com Docker

Com o Docker Desktop aberto e usando contêineres Linux, execute na pasta do projeto:

```bash
docker compose up --build -d
```

Acesse **http://localhost:8081**. O primeiro build demora mais porque baixa as imagens e instala as dependências.

O Compose inicia o PostgreSQL, aguarda sua disponibilidade, aplica as migrations, cria o administrador se ele ainda não existir e inicia a aplicação. Os chamados e usuários ficam em um volume persistente. O PostgreSQL já instalado no Windows não é utilizado nem alterado.

### Login inicial

Se existir `.env`, o administrador será criado com os valores `SEED_ADMIN_EMAIL` e `SEED_ADMIN_SENHA` desse arquivo. A configuração local anterior foi preservada nessas variáveis.

Em uma cópia nova, sem `.env`, os padrões para uso local são:

- E-mail: `admin@helpdesk.local`
- Senha: `helpdesk123`

Para personalizar antes da primeira inicialização, copie `.env.example` para `.env` e edite seus valores. No PowerShell:

```powershell
Copy-Item .env.example .env
```

Não sobrescreva seu `.env` se ele já existir. Nunca envie esse arquivo ao Git. As credenciais padrão são destinadas ao ambiente local, que é publicado apenas em `127.0.0.1`.

O seed não redefine senhas de usuários existentes. Alterar `SEED_ADMIN_SENHA` após o primeiro cadastro não muda a senha salva no banco. Da mesma forma, alterar `POSTGRES_PASSWORD` não redefine automaticamente a senha de um volume já inicializado.

### Comandos úteis

```bash
# Estado e saúde dos serviços
docker compose ps

# Acompanhar mensagens da aplicação
docker compose logs -f app

# Parar sem apagar os dados
docker compose down

# Aplicar alterações de código à versão Docker
docker compose up --build -d
```

Não use `docker compose down -v` para uma parada normal: a opção `-v` remove o volume com os dados.

### Portas

| Serviço | Endereço |
| --- | --- |
| Sistema completo | http://localhost:8081 |
| Verificação de saúde da API | http://localhost:8081/api/health |
| PostgreSQL do Docker para ferramentas locais | localhost:15432 |

`APP_PORT` e `DB_PORT` no `.env` permitem trocar as portas externas. A API usa `/api` no mesmo endereço da interface. Dentro do Compose, a aplicação conecta ao serviço `db`; fora do Docker, `DATABASE_URL` aponta para `localhost:15432`.

O banco Docker começa separado do banco anterior. Dados antigos não são importados automaticamente.

## Desenvolver com atualização automática

Requer Node.js 24 e Docker Desktop. Todos os comandos são executados na raiz:

```bash
npm ci
docker compose up -d db
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Esse modo usa o `.env`; crie-o a partir do exemplo caso ainda não exista. O valor de `DATABASE_URL` deve conter a mesma senha de `POSTGRES_PASSWORD` e a porta publicada em `DB_PORT`. Se a senha tiver caracteres reservados de URL, codifique-os na `DATABASE_URL`.

Abra **http://localhost:5173**. Um único comando inicia Vite e Express; Vite encaminha `/api` para o servidor na porta `PORT` (padrão 3000). `Ctrl+C` encerra os dois processos. Para desenvolvimento sem Docker, configure `DATABASE_URL` para um PostgreSQL acessível.

Para testar o build local:

```bash
npm run build
npm start
```

Abra **http://localhost:3000**. O banco precisa estar disponível e as migrations aplicadas. Esse comando não cria nem redefine usuários automaticamente.

## Estrutura

```text
HelpDesk/
  src/
    components/        Telas, quadro de chamados e seletor de tema
    config/            Endereço relativo da API
    utils/             Preferência de tema
    assets/            Recursos da interface
    server/
      server.js        API Express e entrega da interface compilada
      lib/prisma.js    Conexão com o banco
      generated/       Cliente gerado pelo Prisma, fora do Git
    App.jsx            Rotas da interface
    main.jsx           Inicialização do React
    index.css          Estilos globais e temas
  prisma/
    schema.prisma      Modelos de dados
    migrations/        Histórico do banco
    seed.js            Administrador inicial
  scripts/
    dev.js             Inicialização conjunta em desenvolvimento
    start-container.js Migrations, seed e servidor no Docker
  public/              Arquivos públicos
  images/              Capturas de tela do projeto
  index.html
  package.json
  package-lock.json
  prisma.config.ts
  vite.config.js
  eslint.config.js
  Dockerfile
  compose.yaml
  .env.example
```

Não existem mais instalações independentes em `backend` e `frontend`. O servidor permanece separado dos componentes dentro de `src/server` para que código de banco e segredos não sejam incluídos no bundle do navegador.

## Fluxos principais

- Login com JWT e senhas protegidas com bcrypt.
- Criação de chamados de Hardware, Software, Rede e Outro.
- Quadro com Abertos, Concluídos e Fechados, busca e filtros.
- Detalhes, atribuição de técnico e registro de solução.
- Acesso administrativo ao cadastro de usuários.
- Tema claro ou escuro salvo no navegador.

Todos os endpoints de negócio usam o prefixo `/api`, por exemplo `/api/login`, `/api/perfil` e `/api/chamados`. O healthcheck retorna 503 se o banco estiver indisponível.

## Verificações

```bash
npm run build
npm run lint
```

Com o Compose rodando e o `.env` configurado, execute `npm run test:integration` para testar login, perfis, cadastro, visibilidade dos chamados, atribuição e conclusão. O teste cria registros temporários identificados e remove apenas esses registros ao terminar. A interface não usa dados simulados.

Também foram corrigidas a listagem de usuários, a definição do cargo no cadastro, a leitura dos nomes nos detalhes e a autorização antes de alterar chamados. As requisições das telas de detalhes e usuários são canceladas ao desmontar os componentes.

## Referências do ambiente Docker

- [Ordem de inicialização e healthchecks no Compose](https://docs.docker.com/compose/how-tos/startup-order/)
- [Imagem oficial do PostgreSQL e volumes da versão 18](https://hub.docker.com/_/postgres)
