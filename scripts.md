# Nest

Instala o CLI do nestjs globalmente

- npm i -g @nestjs/cli

Cria um novo projeto NestJs

- nest new nome-do-projeto
  escolha do pacote: pnpm

# Docker

Após criar o _docker-compose.yml_, starta o docker:

- docker compose up -d
- docker ps
  Verifica se está rodando

_Adiciona o diretório data no .gitignore_

# Prisma

- pnpm i prisma -D
- pnpm i @prisma/client
- pnpm prisma init
  - _Adiciona o .env no .gitignore_
  - Altera as variáveis do docker-compose no .env
  - Cria os models no schema.prisma
- pnpm prisma migrate dev
- pnpm prisma studio
