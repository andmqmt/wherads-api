# WherAds API

API backend da plataforma WherAds — insights inteligentes sobre comportamento do consumidor para campanhas de marketing.

## Stack

- **NestJS 11** — Framework Node.js para aplicações server-side escaláveis
- **TypeScript 5** — Tipagem estática para maior segurança e produtividade
- **Prisma v7** — ORM type-safe para PostgreSQL (adapter pattern)
- **PostgreSQL** — Banco de dados relacional
- **Swagger** — Documentação da API acessível em `/api/docs`

## Arquitetura

O projeto segue **Clean Architecture** organizado por módulos de feature:

```
src/
├── common/              # Filtros, interceptors, decorators compartilhados
│   ├── filters/         # AllExceptionsFilter (tratamento global de erros)
│   ├── interceptors/    # LoggingInterceptor (tempo de resposta)
│   └── decorators/      # CurrentUser decorator
├── config/              # Validação de variáveis de ambiente
├── prisma/              # Módulo e service do Prisma (global)
└── modules/
    ├── auth/            # Módulo de autenticação (JWT)
    │   ├── domain/      # Entidades e contratos de repositório
    │   ├── application/ # Use cases, DTOs e testes unitários
    │   ├── infrastructure/ # Implementações de repositório (Prisma)
    │   └── presentation/   # Controllers, guards e strategies
    └── campaign/        # Módulo de campanhas (CRUD)
        ├── domain/
        ├── application/
        ├── infrastructure/
        └── presentation/
```

## Funcionalidades

- **Autenticação JWT** — Registro, login e endpoint protegido (`GET /auth/me`)
- **CRUD de Campanhas** — Criar, listar, buscar, atualizar e excluir campanhas (com ownership check)
- **Cache** — Cache em memória no endpoint de listagem (TTL 30s)
- **Logging** — Interceptor que loga tempo de resposta + filtro global de exceções
- **Seed** — Dados iniciais (admin@wherads.com / 123456 + 5 campanhas)
- **Validação** — DTOs validados automaticamente com class-validator
- **Swagger** — Documentação completa em `/api/docs`

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

# 5. (Opcional) Popular com dados de seed
npm run prisma:seed

# 6. Iniciar em modo de desenvolvimento
npm run start:dev
```

A API estará disponível em `http://localhost:3001` e o Swagger em `http://localhost:3001/api/docs`.

### Com Docker

```bash
docker build -t wherads-api .
docker run -p 3001:3001 --env-file .env wherads-api
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | Inicia em modo desenvolvimento (watch) |
| `npm run build` | Compila o projeto |
| `npm run start:prod` | Inicia em modo produção |
| `npm run lint` | Roda ESLint com auto-fix |
| `npm run format` | Formata código com Prettier |
| `npm run test` | Roda testes unitários |
| `npm run prisma:seed` | Popula banco com dados de exemplo |

## Dependências

### Produção

| Pacote | Justificativa |
|--------|---------------|
| `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express` | Framework principal do NestJS |
| `@nestjs/config` | Gerenciamento e validação de variáveis de ambiente no boot |
| `@nestjs/swagger` | Geração automática da documentação Swagger/OpenAPI via decorators |
| `@nestjs/jwt` | Geração e verificação de tokens JWT para autenticação |
| `@nestjs/passport`, `passport`, `passport-jwt` | Integração do Passport como guard do NestJS para estratégia JWT |
| `@nestjs/cache-manager`, `cache-manager` | Cache em memória com TTL para endpoints de listagem |
| `@prisma/client`, `@prisma/adapter-pg`, `prisma` | ORM type-safe com adapter pattern (v7) para PostgreSQL |
| `pg` | Driver PostgreSQL nativo (usado pelo adapter do Prisma v7) |
| `bcryptjs` | Hash de senhas com bcrypt (versão JS pura, sem compilação nativa) |
| `class-validator`, `class-transformer` | Validação e transformação de DTOs com decorators |
| `reflect-metadata` | Suporte ao sistema de decorators/metadata do TypeScript (requisito do NestJS) |
| `rxjs` | Programação reativa (dependência core do NestJS — interceptors, pipes, etc.) |

### Desenvolvimento

| Pacote | Justificativa |
|--------|---------------|
| `typescript`, `ts-node`, `ts-jest`, `ts-loader`, `tsconfig-paths` | Compilação, execução e resolução de paths TypeScript |
| `eslint`, `typescript-eslint`, `eslint-config-prettier`, `eslint-plugin-prettier` | Linting com regras TypeScript e integração com Prettier |
| `prettier` | Formatação automática de código |
| `husky` | Git hooks para validação pré-commit e pré-push |
| `lint-staged` | Roda linters apenas nos arquivos staged (commit mais rápido) |
| `@commitlint/cli`, `@commitlint/config-conventional` | Enforce do padrão Conventional Commits nas mensagens |
| `jest`, `@nestjs/testing`, `supertest` | Testes unitários e e2e com framework do NestJS |
| `@types/*` | Tipagens TypeScript para bibliotecas JS |

## Diferenciais

- ✅ Docker (Dockerfile multi-stage)
- ✅ Testes unitários (use cases de auth e campaigns)
- ✅ CI/CD (GitHub Actions — lint, build, testes)
- ✅ Validação de dados (class-validator + ValidationPipe)
- ✅ Seed de dados
- ✅ Cache em memória
- ✅ Logging estruturado

## Git Workflow

- **Husky** — Git hooks para pré-commit (lint-staged) e commit-msg (commitlint)
- **lint-staged** — Roda ESLint + Prettier nos arquivos staged antes do commit
- **Conventional Commits** — Padrão de mensagens de commit (`feat:`, `fix:`, `chore:`, etc.)
