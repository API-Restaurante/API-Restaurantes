
// authMiddleware.js
const jwt = require('jsonwebtoken');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

function authenticateToken(req, res, next) {
    // Captura o token do cabeçalho Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    // Verifica e decodifica o token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado.' });
        }

        // Adiciona o usuário decodificado ao request para uso posterior
        req.userId = user.id;
        next();
    });
}

module.exports = authenticateToken;
