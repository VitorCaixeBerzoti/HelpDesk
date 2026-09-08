# HelpDesk

Sistema de HelpDesk desenvolvido como projeto pessoal para praticar o desenvolvimento de uma aplicação Full Stack, trabalhando desde a interface até autenticação, API REST e banco de dados.

A aplicação permite que usuários criem e acompanhem solicitações de suporte, enquanto técnicos e administradores possuem acesso ao gerenciamento dos chamados.

## Funcionalidades

### Autenticação
- Login com email e senha
- Autenticação utilizando JWT
- Senhas armazenadas com hash utilizando bcrypt
- Rotas protegidas para usuários autenticados

### Chamados
- Criação de novos chamados
- Listagem dos chamados
- Visualização dos detalhes de cada chamado
- Busca por título
- Filtro por status
- Filtro por tipo de ajuda
- Acompanhamento do técnico responsável
- Atualização do status do chamado
- Registro da solução
- Técnico pode assumir um chamado

### Níveis de acesso

O sistema possui três tipos de usuário:

**Usuário**
- Cria chamados
- Visualiza seus próprios chamados
- Acompanha status e solução

**Técnico**
- Visualiza os chamados
- Pode assumir chamados
- Atualiza status
- Registra a solução

**Administrador**
- Possui acesso aos chamados
- Pode gerenciar chamados
- Visualiza usuários cadastrados
- Cadastra novos usuários
- Define o cargo dos novos usuários

## Tecnologias utilizadas

### Frontend
- React
- JavaScript
- Vite
- React Router
- CSS

### Backend
- Node.js
- Express
- JWT
- bcrypt
- CORS

### Banco de dados
- PostgreSQL
- Prisma ORM

## Estrutura do projeto

```text
HelpDesk/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── seed.js
│   │
│   ├── src/
│   │   ├── generated/
│   │   ├── lib/
│   │   └── server.js
│   │
│   └── package.json
│
└── README.md
```

## Screenshots

### Login

<<<<<<< HEAD
![Tela de Login](docs/images/login.png)

### Dashboard

![Dashboard](docs/images/dashboard.png)

### Novo chamado

![Novo Chamado](docs/images/novo-chamado.png)

### Detalhes do chamado

![Detalhes do Chamado](docs/images/detalhes-chamado.png)

### Gerenciamento de usuários

![Gerenciamento de Usuários](docs/images/usuarios.png)
=======
![Tela de Login](docs/images/Tela_de_Login.png)

### Dashboard

![Dashboard](docs/images/Dashboard.png)

### Novo chamado

![Novo Chamado](docs/images/NovoChamado.png)

### Detalhes do chamado

![Detalhes do Chamado](docs/images/Detalhes_do_Chamado.png)

### Gerenciamento de usuários

![Gerenciamento de Usuários](docs/images/Gerenciamento_de_Usuario.png)

## Como executar o projeto

### Pré-requisitos

Antes de começar, é necessário ter instalado:

- Node.js
- PostgreSQL
- Git

### 1. Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd HelpDesk
```

## Backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` dentro da pasta `backend`.

Você pode utilizar o `.env.example` como referência:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/helpdesk
JWT_SECRET=sua_chave_secreta

PORT=3000
FRONTEND_URL=http://localhost:5173

SEED_ADMIN_NOME=Administrador
SEED_ADMIN_EMAIL=admin@email.com
SEED_ADMIN_SENHA=sua_senha
```

Aplique as migrations:

```bash
npx prisma migrate deploy
```

Crie o usuário administrador inicial:

```bash
npx prisma db seed
```

Inicie o backend:

```bash
npm run dev
```

Por padrão, a API será executada em:

```text
http://localhost:3000
```

## Frontend

Abra outro terminal e entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Inicie o frontend:

```bash
npm run dev
```

Por padrão, a aplicação estará disponível em:

```text
http://localhost:5173
```

## Segurança

Algumas medidas utilizadas no projeto:

- Hash de senhas com bcrypt
- Autenticação através de JWT
- Rotas protegidas no backend
- Controle de acesso baseado no cargo do usuário
- Identificação do usuário através do token
- Variáveis sensíveis armazenadas em arquivos `.env`

Os arquivos `.env` não são enviados ao repositório.

## Objetivo do projeto

O principal objetivo deste projeto foi colocar em prática conhecimentos que eu vinha estudando separadamente e entender melhor como as diferentes partes de uma aplicação Full Stack se conectam.

Durante o desenvolvimento trabalhei principalmente com:

- criação e consumo de API REST
- autenticação e autorização
- comunicação entre frontend e backend
- modelagem e manipulação de banco de dados
- relacionamentos utilizando Prisma
- proteção de rotas
- controle de acesso por tipo de usuário
- tratamento de erros
- organização do projeto
- versionamento utilizando Git e GitHub

## Status

O sistema está funcional para execução local.

O deploy da aplicação poderá ser realizado futuramente.

## Autor

<<<<<<< HEAD
Desenvolvido por **Vitor Caixe** como projeto pessoal de estudo e portfólio.
=======
Desenvolvido por **Vitor Caixe** como projeto pessoal de estudo e portfólio.
>>>>>>> e3a47b02b0c6e085794872402fc3a1bd1855ab91
