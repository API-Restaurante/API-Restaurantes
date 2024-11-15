const Reserva = require("../models/Reserva")
const mongoose = require("mongoose")

exports.listarTodasReservas = async (req, res) => {
    try{
        const reservas = await Reserva.find()
        res.status(201).json(reservas)
    }catch{
        res.status(404).json({message:"ocorreu um erro inesperado"})
    }
}

exports.novaReserva = async (req, res) =>{
        const {dia, horario, mesa, quantidadePessoas} = req.body
        const usuarioId = req.userId;

        if (!usuarioId || !mongoose.Types.ObjectId.isValid(usuarioId)) {
            return res.status(400).json({ message: 'é obrigatório estar logado para fazer a reserva.' });
        }

    try{
        const novaReserva = new Reserva({
            usuarioId,
            dia: new Date(dia),
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
        const reservas = await Reserva.find({ usuarioId: req.userId });

        if(reservas.length === 0){
            return  res.status(404).json({message: "Ainda não foram realizadas reservas"})
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

exports.filtrarReservasPorData = async (req, res) => {
    try {
        const data = req.query.data; // Captura o parâmetro de data da query
        if (!data) {
            return res.status(400).json({ message: "Data não fornecida" });
        }

        // Filtra as reservas pela data especificada
        const reservas = await Reserva.find({ dia: new Date(data) });
        
        res.json(reservas);
    } catch (error) {
        console.error("Erro ao filtrar reservas por data:", error);
        res.status(500).json({ message: "Erro ao filtrar reservas" });
    }
};

// Função para filtrar reservas por intervalo de data
exports.filtrarReservasPorDataInicialEFinal = async (req, res) => {
    try {
        const { dataInicial, dataFinal } = req.query;

        if (!dataInicial || !dataFinal) {
            return res.status(400).json({ message: 'É necessário fornecer uma data inicial e final.' });
        }

        // Converte as strings de data para objetos Date
        const dataIni = new Date(dataInicial);
        const dataFin = new Date(dataFinal);

        // Ajusta a hora de 'dataIni' para 00:00:00 para garantir que a data inicial seja a partir de meia-noite
        dataIni.setHours(0, 0, 0, 0);

        // Ajusta a hora de 'dataFin' para 23:59:59 para garantir que a data final seja até o final do dia
        dataFin.setHours(23, 59, 59, 999);

        // Filtra as reservas no intervalo de datas fornecido
        const reservas = await Reserva.find({
            dia: { 
                $gte: dataIni,  // Maior ou igual à data inicial
                $lte: dataFin   // Menor ou igual à data final
            }
        });

        // Retorna as reservas encontradas
        res.status(200).json(reservas);

    } catch (error) {
        console.error("Erro ao filtrar reservas:", error);
        res.status(500).json({ message: 'Erro interno ao filtrar reservas.' });
    }
};