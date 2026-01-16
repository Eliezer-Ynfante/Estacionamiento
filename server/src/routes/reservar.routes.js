const express = require('express');
const router = express.Router();
const reservar = require('../controllers/reservar.controller');
const validar = require('../middleware/reservar.validation');
const { verifyToken, optionalVerifyToken } = require('../middleware/auth.middleware');
const limit = require('../middleware/limit.middleware');

// Crear reserva (funciona tanto para autenticados como invitados)
router.post('/reservar', optionalVerifyToken, validar, reservar.crearReservaYPagar);

router.get('/historial', verifyToken, limit,  reservar.historial);

router.get('/reserva/:id', verifyToken, limit, reservar.verificarReserva);

router.delete('/reserva/:id', verifyToken, limit, reservar.cancelarReserva);


module.exports = router;