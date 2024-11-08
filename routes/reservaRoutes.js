const express = require('express');
const { novaReserva, listarReservas, cancelarReserva } = require('../controllers/reservaController');

const router = express.Router();

router.post('/', novaReserva); 
router.get('/:usuarioId', listarReservas); 
router.delete('/:reservaId', cancelarReserva);

module.exports = router;