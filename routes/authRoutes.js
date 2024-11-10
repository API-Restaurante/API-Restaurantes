const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware'); // Importe o middleware
const { login } = require('../controllers/userControllerMemoria');


//ROTA DE TESTE
router.post('/teste', login);

// Rota para Cadastrar usuário (não precisa de autenticação)
router.post('/register', authController.register);

// Rota para Login de usuário (não precisa de autenticação)
router.post('/login', authController.login);

// Rotas protegidas
router.delete('/delete/:id', authenticateToken, authController.delete);
router.put('/update/:id', authenticateToken, authController.update);
router.get('/user/:id', authenticateToken, authController.getUserById);
router.get('/users', authenticateToken, authController.getUsers);

// Rota protegida para o dashboard do admin
router.get('/admin-dashboard', authenticateToken, (req, res) => {
    if (req.user.nivel_acesso === 1) {
        res.sendFile(path.join(__dirname, '/admin-dashboard.html'));
    } else {
        res.status(403).json({ message: 'Acesso negado: apenas administradores podem acessar esta página.' });
    }
});

// Rota protegida para o dashboard do usuário comum
router.get('/home', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '/home.html'));
});


module.exports = router;