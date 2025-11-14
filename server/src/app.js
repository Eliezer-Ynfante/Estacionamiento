const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require("cors");
require("dotenv").config();
const { notFound, errorHandler } = require("./middleware/error.middleware");
const morgan = require("morgan");
const helmet = require("helmet");

// Rutas
const mainRoutes = require("./routes/main.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const reservarRoutes = require("./routes/reservar.routes");
const plazaRoutes = require("./routes/plaza.routes");


app.use(cookieParser());

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear datos de formularios
app.use(helmet());
app.use(morgan("dev"));

app.use(session({
    secret: process.env.SESSION_SECRET || 'mi-secreto-super-seguro',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
    // store: new RedisStore({ client: redisClient })
}));


// Montar rutas de la API
app.use("/api", mainRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/service", reservarRoutes);
app.use("/api/plaza", plazaRoutes);

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;
