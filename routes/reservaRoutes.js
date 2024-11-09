const express = require('express');
const reservaControllerTeste = require('../controllers/reservaControllerMemoria');
const reservaController = require("../controllers/reservaController")

const router = express.Router();

router.post('/teste', reservaControllerTeste.novaReservaTeste); 
router.get('/teste/:usuarioId', reservaControllerTeste.listarReservasTeste); 
router.delete('/teste/:reservaId', reservaControllerTeste.cancelarReservaTeste);

router.post('/:usuarioId', reservaController.novaReserva)
router.get("/:usuarioId", reservaController.listarReservas)
router.get("/", reservaController.listarTodasReservas)
router.delete("/:reservaId", reservaController.cancelarReserva)

module.exports = router;