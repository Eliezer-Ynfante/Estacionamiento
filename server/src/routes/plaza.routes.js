const express = require('express');
const router = express.Router();
const { param, query } = require('express-validator');
const plazaController = require('../controllers/plaza.controller');
const limit = require('../middleware/limit.middleware');

// Obtener todas las plazas clasificadas
router.get('/plazas', limit, plazaController.plazas);

// Obtener solo plazas disponibles (con filtro opcional de fechas)
router.get('/plazas/disponibles', [
    query('fecha_inicio').optional().isISO8601(),
    query('fecha_fin').optional().isISO8601()
], limit, plazaController.plazas_diponibles);

// Obtener detalle de una plaza específica
router.get('/plaza/:plaza_id', [
    param('plaza_id').isInt({ min: 1 })
], limit,  plazaController.detalle_plaza);

module.exports = router;