const express = require('express');
const router = express.Router();
const { testConnection } = require('../config/conexion');

// Ruta de inicio para el cliente
router.get('/inicio', (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      message: 'Bienvenido al API de Estacionamiento',
      description: 'Punto de conexión entre cliente y servidor'
    }
  });
});

// Información de contacto mínima para el cliente
router.get('/contacto', (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      email: process.env.CONTACT_EMAIL || 'contacto@estacionamiento.local',
      telefono: process.env.CONTACT_PHONE || null,
      horario: 'Lun-Vie 09:00-18:00'
    }
  });
});

module.exports = router;
