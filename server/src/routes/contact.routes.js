const express = require('express');
const router = express.Router();
const { enviarContacto } = require('../controllers/contact.controller');
const { contactValidations, handleValidationErrors } = require('../middleware/contact.validation');

/**
 * POST /api/contact
 * Recibir y procesar mensaje de contacto del formulario
 */
router.post('/', contactValidations, handleValidationErrors, enviarContacto);

module.exports = router;
