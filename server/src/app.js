const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const { notFound, errorHandler } = require("./middleware/error.middleware");
const morgan = require("morgan");
const helmet = require("helmet");

// Rutas
const mainRoutes = require("./routes/main.routes");
const authRoutes = require("./routes/auth.routes");

// Middlewares
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear datos de formularios
app.use(helmet());
app.use(morgan("dev"));

// Montar rutas de la API
app.use("/api", mainRoutes);
app.use("/api/auth", authRoutes);

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;
