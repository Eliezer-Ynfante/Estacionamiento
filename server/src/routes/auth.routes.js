const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validaciones = require('../middleware/auth.validation');

// POST /api/auth/register
router.post('/register', validaciones.registro, authController.register);

module.exports = router;
