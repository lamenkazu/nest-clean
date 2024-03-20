Neste commit foi configurado o projeto para acessar as variáveis de ambiente em qualquer arquivo de aplicação.
Foi utilizado o @nestjs/config do Nest, que é recomendado pela documentação.

Neste commit, começa a configuração da autenticação JWT na aplicação, utilizando Passport que é uma biblioteca popular para autenticação no Node.js, e o JWT é uma estratégia de autenticação escolhida para a aplicação

Neste commit foi convertido o conteúdo de um arquivo para base64 e essa conversão foi usada para gerar chaves privadas e públicas para autentição JWT rsa256. Para isso foi utilizado o OpenSSL para gerar essas chaves no formato correto. Em seguida, implementado a geração de um token de autenticação usando a chave privada e validada a assinatura do token usando a chave pública.

Neste commit foi criada a configuração do AuthGuard, para que as rotas que o tenham só possam ser acessadas se o usuário estiver autenticado.
Para exemplo foi criada o Controller CreateQuestion, que apenas implementa o AuthGuard.
Foi configurado o arquivo jwt.strategy.ts com a public key do rsa256, e então injetada no auth.module para ser vista pelo projeto.
Foi também cfriada uma classe jwt-auth.guard.ts para facilitar a implementação nos Controllers.
No client.http foi implementada uma forma automática de pegar o token da autenticação e utilizar como Header Authorization das rotas que utilizam o AuthGuard
Nota: alteração do autenticate-controller para authenticate.controller pra manter o padrão do projeto.
