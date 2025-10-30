const express = require('express');
const path = require('path');
const cors = require('cors');
const { testConnection, pool } = require('./config/conexion');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear datos de formularios

// Verificar la conexión a la base de datos
testConnection()
    .then(isConnected => {
        if (!isConnected) {
            console.error('No se pudo establecer la conexión a la base de datos');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('Error al verificar la conexión:', error);
        process.exit(1);
    });

// Ruta principal
app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend de estacionamiento funcionando correctamente' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

module.exports = app;
