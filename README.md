# Pré-Processamento de Vídeos

- Semana JS Expert 8.0

- Recriei um site, onde aplico um novo método de Pré-processamento de vídeos, que tira das mãos do servidor e passei para o lado do cliente processar, ele processa sobre demanda, o que diminui em muito a utilização de maquina, reduzindo custos para a empresa fornecedora do conteúdo.

## Pre-requisitos

- Este projeto foi criado usando Node.js v18.17.0
- O ideal é que você use o projeto em ambiente Unix (Linux). Se você estiver no Windows, é recomendado que use o [Windows Subsystem Linux](https://www.omgubuntu.co.uk/how-to-install-wsl2-on-windows-10) pois nas aulas são mostrados comandos Linux que possam não existir no Windows.

## Running

- Execute `npm ci` na pasta que contém o arquivo `package.json` para restaurar os pacotes
- Execute `npm start` e em seguida vá para o seu navegador em [http://localhost:3000](http://localhost:3000) para visualizar a página acima

[Roadmap DEV Especialista](https://roadmap.sh/r?id=652d1f1df43a58c923d71231)

    Metodologia JS Expert para se tornar um DEV Especialista em JavaScript.

### FAQ

- browser-sync está lançando erros no Windows e nunca inicializa:
  - Solução: Trocar o browser-sync pelo http-server.
    1. instale o **http-server** com `npm i -D http-server`
    2. no package.json apague todo o comando do `browser-sync` e substitua por `npx http-server .`
    3. agora o projeto vai estar executando na :8080 então vá no navegador e tente acessar o http://localhost:8080/
       A unica coisa, é que o projeto não vai reiniciar quando voce alterar algum código, vai precisar dar um F5 na página toda vez que alterar algo
