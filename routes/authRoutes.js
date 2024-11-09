const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para Cadastrar usuário
router.post('/register', authController.register);

// Rota para Login de usuário
router.post('/login', authController.login);

// Rota para Deletar usuário
router.delete('/delete/:id', authController.delete);

// Rota para Atualizar usuário
router.put('/update/:id', authController.update);

// Rota para listar todos os usuários
router.get('/users', authController.getUsers);

module.exports = router;