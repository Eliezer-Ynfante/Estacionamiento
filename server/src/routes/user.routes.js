const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const  { verifyToken } = require('../middleware/auth.middleware');
const validaciones = require('../middleware/auth.middleware');

// GET /api/user/me
router.get('/me', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Usuario autenticado',
    data: req.user, 
  });
});

router.get('update-me', verifyToken, validaciones.update , userController.actualizarUsuario);
router.delete('delete-me', verifyToken, userController.eliminarUsuario);

module.exports = router;


