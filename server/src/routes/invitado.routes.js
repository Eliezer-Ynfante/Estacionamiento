const express = require('express');
const router = express.Router();
const invitadoController = require('../controllers/invitado.controller');

// GET /api/invitados/:invitado_id - Obtener datos de un invitado
router.get('/:invitado_id', invitadoController.obtenerInvitado);

// GET /api/invitados/:invitado_id/reservas - Obtener reservas de un invitado
router.get('/:invitado_id/reservas', invitadoController.obtenerReservasInvitado);

// PUT /api/invitados/:invitado_id - Actualizar información de un invitado
router.put('/:invitado_id', invitadoController.actualizarInvitado);

module.exports = router;