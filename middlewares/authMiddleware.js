const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    // Pegue o token do cabeçalho de autorização
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado: token ausente' });
    }

    // Verifique o token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Acesso negado: token inválido' });
        }

        // Armazene o usuário no objeto de requisição
        req.user = user; 
        next(); // Passa para a próxima função (ou rota)
    });
}

module.exports = authenticateToken;
