const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// Defina uma chave secreta para assinar o token JWT (deve estar no arquivo .env)
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// Rota para listar todos os usuários
exports.getUsers = async (req, res) => {
    try {
        // Buscar todos os usuários no banco
        const users = await User.find();

        // Retornar a lista de usuários
        res.status(200).json(users);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message || "Erro desconhecido" });
    }
};


// Rota de login
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Verificar se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verificar a senha
        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, nivel_acesso: user.nivel_acesso }, // Incluir 'nivel_acesso' no payload do token
            JWT_SECRET,
            { expiresIn: '1h' } // Expira em 1 hora
        );

        // Verificar o nível de acesso e redirecionar para a página correspondente
        if (user.nivel_acesso === 1) {
            // Se o usuário for administrador (nivel_acesso 1), redireciona para a página do administrador
            return res.redirect('/admin-dashboard.html'); // Altere para o caminho correto da página de administração
        } else {
            // Se o usuário for comum (nivel_acesso 0), redireciona para a página do usuário
            return res.redirect('/home.html'); // Altere para o caminho correto da página do usuário
        }

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: 'Erro ao fazer login', error: error.message || "Erro desconhecido" });
    }
};

// Rota para deletar usuário
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Encontrar e deletar o usuário
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        res.status(500).json({ message: 'Erro ao deletar usuário', error: error.message || "Erro desconhecido" });
    }
};

// Rota para atualizar usuário
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha } = req.body;

        // Preparar dados para atualização
        const updateData = { nome, email };
        if (senha) {
            updateData.senha = await bcrypt.hash(senha, 10);
        }

        // Atualizar o usuário
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({
            message: 'Usuário atualizado com sucesso',
            user: {
                id: updatedUser._id,
                nome: updatedUser.nome,
                email: updatedUser.email
            }
        });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message || "Erro desconhecido" });
    }
}

exports.register = async (req, res) => {
    try {
        const { nome, email, senha, nivel_acesso } = req.body;

        // Verificar se o email já está em uso
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Este email já está em uso' });
        }

        // Hashear a senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Criar novo usuário
        const newUser = new User({
            nome,
            email,
            senha: hashedPassword,
            nivel_acesso
        });

        // Salvar usuário no banco
        await newUser.save();

        // Gerar um token JWT para o novo usuário
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '1h' } // O token expira em 1 hora
        );

        // Responder com o token JWT e informações do usuário
        res.status(201).json({
            message: 'Usuário cadastrado com sucesso',
            token,
            user: {
                id: newUser._id,
                nome: newUser.nome,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error); // Log detalhado do erro no console
        res.status(500).json({
            message: 'Erro ao registrar usuário',
            error: error.message || "Erro desconhecido"
        });
    }
};
