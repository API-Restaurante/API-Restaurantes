const mongoose = require("mongoose")

const reservaSchema = mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Usuario' },
    dia: { type: String, required: true },
    horario: { type: String, required: true },
    mesa: { type: Number, required: true },
    quantidadePessoas: { type: Number, required: true },
})

reservaSchema.index({ dia: 1, horario: 1, mesa: 1 }, { unique: true });

module.exports = mongoose.model('Reserva', reservaSchema);
