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

Neste Commit foi criado o Param Decorator que é capaz de pegar os dados do payload do user através do Token.

Neste commit, foi entendido sobre injeção de dependência no NestJS e como lidar com Services que não possuem um @Injectable.
Entre a alternativa de criar uma classe nova na camada de infraestrutura que extende o Service
Foi optado por sujar o domain com a @Injectable diretamente, sabendo que vai contra a regra de desacoplamento da Clean Architecture.

Também foi modificado o uso de interfaces repositories para classes abstratas que possuem métodos abstratos, para a utilização no NestJS, que precisa disso para a injeção de dependência.

Neste Commit foi iniciada a configuração de gateway entre os casos de uso e as funções de criptografia. Para isso foi pensada a Interface Segregation dos SOLID principes, que separa as interfaces (tidas como classes abstradas por causa do NestJS) de critografia para que não seja necessário que toda classe precise implementar todos os métodos da criptografia (hash e compare)
Além disso foi adicionado os dados do estudante email e senha no domain.

Neste commit foi iniciada a configuração para cadastro e autenticação de estudantes.
Foi feita a verificação se já existe um aluno com o mesmo email cadastrado. Em caso positivo, retorna um erro. Em seguida, a comparação da senha informada com a senha armazenada no banco de dados. Se forem diferentes, retorna um erro. Caso contrario, é gerado um token de acesso e ele é retornado.
Tudo isso foi feito em uma nova camada na parte de domínio da aplicação, Account.

# ✨ Registrando Eventos de Domínio

Neste Commit foi configurado os eventos de domínio no projeto na Infraestrutura.

Foi criado então o diretório de eventos que possui o seu próprio módulo: events.module.ts, e então adicionada ao app.module.ts

Na camada de Domínio, tanto os services de Notificaion quanto os subscribers precisam de um Injectable para funcionar corretamente no NestJS.

Entidade Notificaion foi alterada para classe abstrata.

o Schema.Prisma foi atualizado para a tabela notifications, e além disso, foram feito ajustes no repositorio do Prisma, criando um novo repositório de notificações. Ainda há alguns ajustes a serem feitos para que os eventos sejam disparados corretamente.
