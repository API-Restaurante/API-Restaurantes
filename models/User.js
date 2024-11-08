//Importando as Dependências
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Criamos o Schema de Usuário
const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    }
});

// Middleware para criptografar a senha antes de salvar
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('senha')) return next();

    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(user.senha, salt);
    next();
});

// Método para comparar senha digitada com a já salva e criptografada
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.senha);
};

//Cria o modelo de usuário com base na estrutura já pré definida
const User = mongoose.model('User', userSchema);

//Exporta o User para que ele possar ser usado em outros módulos
module.exports = User;