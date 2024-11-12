const express = require('express');
const reservaControllerTeste = require('../controllers/reservaControllerMemoria');
const reservaController = require("../controllers/reservaController")
const authenticateToken = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.post('/teste', reservaControllerTeste.novaReservaTeste); 
router.get('/teste/:usuarioId', reservaControllerTeste.listarReservasTeste); 
router.delete('/teste/:reservaId', reservaControllerTeste.cancelarReservaTeste);

router.post('/', authenticateToken, reservaController.novaReserva)
router.get("/", authenticateToken, reservaController.listarReservas)
router.delete("/:reservaId", reservaController.cancelarReserva)

//Todas reservas do banco
router.get("/todasReservas", authenticateToken, reservaController.listarTodasReservas)

// Nova rota para filtrar reservas por data específica
router.get("/filtrar", authenticateToken, reservaController.filtrarReservasPorData);

module.exports = router;