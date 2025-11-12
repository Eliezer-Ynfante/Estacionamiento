const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validaciones = require('../middleware/auth.validation');

// POST /api/auth/register
router.post('/register', validaciones.registro, authController.register);

// POST /api/auth/login
router.post('/login', validaciones.login, authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;
