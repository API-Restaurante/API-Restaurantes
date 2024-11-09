const Reserva = require("../models/Reserva")
const mongoose = require("mongoose")

exports.novaReserva = async (req, res) =>{
        const {dia, horario, mesa, quantidadePessoas} = req.body
        const usuarioId = req.params.usuarioId;

        if (!usuarioId || !mongoose.Types.ObjectId.isValid(usuarioId)) {
            return res.status(400).json({ message: 'é obrigatório estar logado para fazer a reserva.' });
        }

    try{
        const novaReserva = new Reserva({
            usuarioId,
            dia,
            horario,
            mesa,
            quantidadePessoas,
        });

        await novaReserva.save();
        res.status(201).json(novaReserva);
    }catch(err){
        if(err.code === 11000){
            res.status(400).json({ message: 'não foi possivel reservar, pois essa mesa não está disponivel', err: err.message });
        }else{
            res.status(500).json({ message: 'Ocorreu um erro, tente novamente.', err: err.message });
        }
    }
}

exports.listarReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find({ usuarioId: req.params.usuarioId });

        if(reservas.length === 0){
            res.status(404).json({message: "Ainda não foram realizadas reservas"})
        }

        res.status(200).json(reservas);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar reservas.', err:err.message });
    }
};

exports.cancelarReserva = async (req, res) => {
    try {
        const reservaCancelada = await Reserva.findByIdAndDelete(req.params.reservaId)
            
        if (!reservaCancelada) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }

        res.status(200).json({ message: 'Reserva cancelada com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao cancelar reserva.', err: err.message  });
    }
};