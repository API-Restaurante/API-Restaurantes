const fs = require('fs'); 
const path = require('path'); 

const dataPath = path.join(__dirname, '../data/memoria.json'); //caminho da memoria JONSON

function loadData() {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
}

function saveData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

exports.novaReserva = (req, res) => {
    const { usuarioId, dia, horario, local, quantidadePessoas } = req.body;
    const data = loadData();

    const reservaExistente = data.reservas.find(
        reserva => reserva.dia === dia && reserva.horario === horario && reserva.local === local
    );

    if (reservaExistente) {
        return res.status(400).json({ mensagem: 'Este horário já está reservado.' });
    }

    const novaReserva = {
        id: data.reservas.length + 1,
        usuarioId,
        dia,
        horario,
        local,
        quantidadePessoas
    };

    data.reservas.push(novaReserva);
    saveData(data); 
    res.status(201).json(novaReserva);
};

exports.listarReservas = (req, res) => {
    const { usuarioId } = req.params;
    const data = loadData();

    const reservasUsuario = data.reservas.filter(reserva => reserva.usuarioId === parseInt(usuarioId));
    res.json(reservasUsuario);
};

exports.cancelarReserva = (req, res) => {
    const { reservaId } = req.params;
    const data = loadData();

    const index = data.reservas.findIndex(reserva => reserva.id === parseInt(reservaId));
    if (index === -1) {
        return res.status(404).json({ mensagem: 'Reserva não encontrada.' });
    }

    const reservaCancelada = data.reservas.splice(index, 1)[0];
    saveData(data); 
    res.json({ mensagem: 'Reserva cancelada.', reserva: reservaCancelada });
};