const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validaciones = require('../middleware/auth.validation');
const { verifyToken } = require('../middleware/auth.middleware');

// POST /api/auth/register
router.post('/register', validaciones.registro, authController.register);

// POST /api/auth/login
router.post('/login', validaciones.login, authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/me - Verificar sesión actual
router.get('/me', verifyToken, (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        usuario_id: req.user.usuario_id,
        nombre: req.user.nombre,
        email: req.user.email,
        rol_id: req.user.rol_id
      }
    });
  } catch (error) {
    console.error('Error en /me:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar sesión'
    });
  }
});

module.exports = router;
