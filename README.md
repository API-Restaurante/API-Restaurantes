PREFIXO DAS ROTAS
    
    LOGIN

    /api/auth 
--------------------
    RESERVAS

    /reserva

-----------------
TESTE

    RESERVAS

    GET /teste
    POST /teste/:usuarioId
    DELETE /teste/:reservaId
    -------------------------
    LOGIN

    POST /teste
    -------------------------

PRODUÇÃO

    RESERVAS

    POST /(necessario token) 
    GET /(necessario token)
    DELETE /reservaId
    GET /todasReservas/(necessario token)
    -------------------------
    LOGIN

    POST /login
    POST /register
    DELETE /delete/userId/(necessario token)
    UPDATE /update/userId/(necessario token)
    GET /user/userId/(necessario token)
    GET /users/(necessario token)
--------------------------------------------

PARA RODAR O PROJETO
npm init -y
node app.js

DEPENDENCIAS NECESSARIAS 
npm install 

"dependencies": {
        "bcrypt": "^5.1.1",
        "body-parser": "^1.20.3",
        "cors": "^2.8.5",
        "dotenv": "^16.4.5",
        "express": "^4.21.1",
        "express-validator": "^7.2.0",
        "jsonwebtoken": "^9.0.2",
        "method-override": "^3.0.0",
        "mongoose": "^8.8.0"
      }

----------------------------------------

VARIAVEIS DE AMBIENTE NECESSARIAS

PORT=3000
DATABASE_URL="mongodb+srv://hardwarestorealpha:(SENHA)@cluster0.sccn2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET= (secret_key)