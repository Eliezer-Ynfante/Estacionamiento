const express = require('express');
const router = express.Router();
const reservar = require('../controllers/reservar.controller');
const validar = require('../middleware/reservar.validation');
const { verifyToken } = require('../middleware/auth.middleware');
const limit = require('../middleware/limit.middleware');

router.post('/reservar', verifyToken, validar, reservar.crearReservaYPagar);

router.get('/historial', verifyToken, limit,  reservar.historial);

router.get('/reserva/:id', verifyToken, limit, reservar.verificarReserva);

router.delete('/reserva/:id', verifyToken, limit, reservar.cancelarReserva);


module.exports = router;