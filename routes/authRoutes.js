//Dependências
const express = require('express');
const router = express.Router(); //Controle de Rota do express
const User = require('../models/User'); //Importa Usuário

// Rota para Cadastro
router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        // Validação dos dados (não implementada aqui por simplicidade)
        const newUser = new User({ nome, email, senha });
        await newUser.save();
        res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
        console.error(error);   

        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// Rota para login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const isMatch = await user.comparePassword(senha);
        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }
        // Gerar token JWT (não implementado aqui)
        res.json({ token: 'seuTokenAqui' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
});

module.exports = router;