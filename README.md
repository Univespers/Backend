# Backend

Desenvolvido com _Node.js_ e a framework _Express_, trata de realizar a comunicação entre o banco de dados e o frontend. É responsável por realizar validações de segurança e tratamento de dados.

## Camadas

_Endpoints_ trata de realizar uma interface com o _Frontend_, disponibilizando formas de comunicação através de endereços web.

_Processes_ disponibiliza funções essenciais, usadas pelas duas outras camadas. Trata de validar ou transformar os dados.

_Datapoints_ trata de chamar procedures do _Database_. Não conhece nada da parte interna do _Database_, conhece apenas as procedures, os argumentos que tomam, e as respostas que dão.

## Interface

O _Frontend_ não deve conhecer nada sobre o funcionamento do _Backend_. Todas as interações são realizadas através de endpoints (Endereços web que retornam/recebem um valor).

A comunicação ocorre através de dados JSON, retornados ou enviados no corpo da resposta.

## Implementação

É necessário ter _NPM_ e _Node.js_ instalados.

O comando `npm install` instala todas as dependências de um projeto em uma pasta _node\_modules_.

O comando `npm start` inicia o servidor e indica sua porta onde fica disponível.

## Desenvolvimento

Alterações no código automaticamente reiniciam o servidor, se este estiver ativo. A ferramenta _Nodemon_ trata de detectar alterações no código e reiniciar o servidor.
