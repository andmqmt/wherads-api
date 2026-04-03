# WherAds API

API backend da plataforma WherAds — insights inteligentes sobre comportamento do consumidor para campanhas de marketing.

## Stack

- **NestJS** — Framework Node.js para aplicações server-side escaláveis
- **TypeScript** — Tipagem estática para maior segurança e produtividade
- **Prisma** — ORM type-safe para PostgreSQL
- **PostgreSQL** — Banco de dados relacional
- **Swagger** — Documentação da API acessível em `/api/docs`

## Arquitetura

O projeto segue **Clean Architecture** organizado por módulos de feature:

```
src/
├── common/              # Filtros, interceptors, decorators compartilhados
├── config/              # Validação de variáveis de ambiente
├── prisma/              # Módulo e service do Prisma (global)
└── modules/
    ├── auth/            # Módulo de autenticação (JWT)
    │   ├── domain/      # Entidades e contratos de repositório
    │   ├── application/ # Use cases e DTOs
    │   ├── infrastructure/ # Implementações de repositório
    │   └── presentation/   # Controllers e guards
    └── campaign/        # Módulo de campanhas (CRUD)
        ├── domain/
        ├── application/
        ├── infrastructure/
        └── presentation/
```

## Como rodar localmente

### Pré-requisitos

- Node.js >= 18
- PostgreSQL rodando localmente
- npm

### Passos

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL

# 3. Gerar o Prisma Client
npx prisma generate

# 4. Rodar as migrations
npx prisma migrate dev

# 5. Iniciar em modo de desenvolvimento
npm run start:dev
```

A API estará disponível em `http://localhost:3001` e o Swagger em `http://localhost:3001/api/docs`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | Inicia em modo desenvolvimento (watch) |
| `npm run build` | Compila o projeto |
| `npm run start:prod` | Inicia em modo produção |
| `npm run lint` | Roda ESLint com auto-fix |
| `npm run format` | Formata código com Prettier |
| `npm run test` | Roda testes unitários |
| `npm run test:e2e` | Roda testes end-to-end |

## Dependências

| Pacote | Justificativa |
|--------|---------------|
| `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express` | Framework principal do NestJS |
| `@nestjs/config` | Gerenciamento de variáveis de ambiente com validação |
| `@nestjs/swagger` | Geração automática da documentação Swagger/OpenAPI |
| `@prisma/client`, `prisma` | ORM type-safe para PostgreSQL |
| `class-validator`, `class-transformer` | Validação e transformação de DTOs |
| `reflect-metadata` | Suporte a decorators do TypeScript |
| `rxjs` | Programação reativa (dependência do NestJS) |

### DevDependencies

| Pacote | Justificativa |
|--------|---------------|
| `typescript`, `ts-node`, `ts-jest`, `ts-loader` | Compilação e execução TypeScript |
| `eslint`, `eslint-config-prettier`, `eslint-plugin-prettier`, `typescript-eslint` | Linting e integração com Prettier |
| `prettier` | Formatação automática de código |
| `husky` | Git hooks para validação pré-commit |
| `lint-staged` | Roda linters apenas nos arquivos staged |
| `@commitlint/cli`, `@commitlint/config-conventional` | Padrão de commits (Conventional Commits) |
| `jest`, `supertest`, `@nestjs/testing` | Testes unitários e e2e |

## Git Workflow

- **Husky** — Git hooks para pré-commit (lint-staged) e commit-msg (commitlint)
- **lint-staged** — Roda ESLint + Prettier nos arquivos staged antes do commit
- **Conventional Commits** — Padrão de mensagens de commit (`feat:`, `fix:`, `chore:`, etc.)
