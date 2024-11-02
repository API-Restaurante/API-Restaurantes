// Divisão das tarefas

Sistema de reservas de restaurante

model
usuario:
nome
email 
senha (criptografada com bcrypt)
nivel_permisao
--------
reserva:
horario
local
mesa
usuario que reservou
--------
restaurantes:
imagem
nome
endereço
status
---------

sistema de autenticação:
rota:
/register (post criar novo usuario)
/login (autenticação com bcrypt.implementar)

necessario admin e client

tratativa de erros: try catch; send.status().json

CRUD do tema
post
get
put
delete

documentação completa

telas
- gerenciamento de reservas
- login e cadastro
- gerenciamento de usuarios
- lista de restaurantes 

------

algum metodo de calculo relacionado ao tema
ex: quantidade de restaurantes reservados

--------------------------Instalar-----------------------------------

- npm init -y

- npm install (express, mongoose, bcrypt, dotenv, body-parser, cors, jsonwebtoken)

--------------------------MongoDB-----------------------------------

Acesso via URL ao banco cloud