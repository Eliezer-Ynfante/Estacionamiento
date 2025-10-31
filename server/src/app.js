const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const { notFound, errorHandler } = require('./middleware/error.middleware');

// Middlewares
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear datos de formularios

// Ruta principal
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API de Estacionamiento funcionando correctamente' });
});

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;
