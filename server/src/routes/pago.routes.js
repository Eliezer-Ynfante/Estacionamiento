const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pago.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const limit = require('../middleware/limit.middleware');

// Obtener detalles de un pago
router.get('/pago/:pago_id', verifyToken, limit, pagoController.obtenerPago);

// Obtener todos los pagos del usuario
router.get('/pagos', verifyToken, limit, pagoController.obtenerPagosPorUsuario);

// Obtener pagos de una reserva específica
router.get('/pagos/reserva/:reserva_id', verifyToken, limit, pagoController.obtenerPagosPorReserva);

module.exports = router;