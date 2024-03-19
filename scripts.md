# Nest

Instala o CLI do nestjs globalmente

```bash
npm i -g @nestjs/cli
```

Cria um novo projeto NestJs

```bash
nest new nome-do-projeto
```

escolha do pacote: pnpm

# Docker

Após criar o _docker-compose.yml_, starta o docker:

```bash
docker compose up -d
```

```bash
docker ps
```

Verifica se está rodando

_Adiciona o diretório data no .gitignore_

# Prisma

```bash
pnpm i prisma -D
```

```bash
pnpm i @prisma/client
```

```bash
pnpm prisma init
```

- _Adiciona o .env no .gitignore_
- Altera as variáveis do docker-compose no .env
- Cria os models no schema.prisma

```bash
pnpm prisma migrate dev
```

```bash
pnpm prisma studio
```

# Token JWT RSA256

Instalar o OpenSSL para gerar private e public key do JWT RSA256.
Após instalado, gerou as keys utilizando o PEM: "teste", usando os scripts:

```bash
openssl genpkey -algorithm RSA -out private_key.pem -aes256
```

```bash
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

A partir disso é gerado uma versão base64 para usar no .env, utilizando os scripts abaixo no powershell:

```bash
$Content = Get-Content private_key.pem -Raw
$Base64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($Content))
$Base64 | Out-File -Encoding ASCII private_key_base64.txt
```

```bash
$Content = Get-Content public_key.pem -Raw
$Base64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($Content))
$Base64 | Out-File -Encoding ASCII public_key_base64.txt
```

E a partir desses arquivos txt o código é colocado no .env diretamente entre aspas

Um erro ocorre quando tenta gerar o token, então é necessário rodar todo esse script no Ubuntu WSL:

```bash
# Gerar a chave privada
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048

# Gerar a chave pública
openssl rsa -pubout -in private.key -out public.key -outform PEM

# Converter a chave privada para base64
JWT_PRIVATE_KEY=$(openssl base64 -in private.key -A)

# Converter a chave pública para base64
JWT_PUBLIC_KEY=$(openssl base64 -in public.key -A)

# Adicionar as chaves ao arquivo .env
echo "JWT_PRIVATE_KEY=\"$JWT_PRIVATE_KEY\"" >> .env
echo "JWT_PUBLIC_KEY=\"$JWT_PUBLIC_KEY\"" >> .env

# Remover os arquivos de chave
rm private.key public.key
```
