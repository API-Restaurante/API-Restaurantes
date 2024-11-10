const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

// Middleware para rotas protegidas (aplicado globalmente)
router.use(authenticateToken);

// Rotas protegidas
router.delete('/delete/:id', authController.delete);
router.put('/update/:id', authController.update);
router.get('/user/:id', authController.getUserById);
router.get('/users', authController.getUsers);

// Rota protegida do dashboard do admin
router.get('/admin-dashboard', (req, res) => {
    if (req.user.nivel_acesso !== 1) {
        return res.status(403).json({ message: 'Acesso negado: apenas administradores podem acessar esta página.' });
    }
    res.sendFile(path.join(__dirname, '/admin-dashboard.html'));
});

// Rota protegida para a página inicial do usuário comum
router.get('/home', (req, res) => {
    if (req.user.nivel_acesso !== 0) {
        return res.status(403).json({ message: 'Acesso negado: apenas usuários comuns podem acessar esta página.' });
    }
    res.sendFile(path.join(__dirname, '/home.html'));
});

module.exports = router;
