const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    senha: {
        type: String,
        required: true,
    },
    nivel_acesso: {
        type: Number,
        required: true,
        enum: [0, 1],
        default: 0,
    }
});

module.exports = mongoose.model('User', UserSchema);
