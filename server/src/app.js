// 1. LIBRERÍAS EXTERNAS
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();

// 2. MIDDLEWARES LOCALES
const { notFound, errorHandler } = require("./middleware/error.middleware");
const { cookieJwtAuth } = require("./middleware/cookieJWTAuth");
const limite = require("./middleware/limit.middleware");

// 3. CONTROLADORES
const authCtrl = require("./controllers/auth.controller");
const userCtrl = require("./controllers/user.controller");
const vehicleCtrl = require("./controllers/vehicle.controller");
const rateCtrl = require("./controllers/rate.controller");
const bookingCtrl = require("./controllers/booking.controller");
const paymentCtrl = require("./controllers/payment.controller");
const serviceCtrl = require("./controllers/service.controller");
const contactCtrl = require("./controllers/contact.controller");

const app = express();

// 4. CONFIGURACIÓN DE MIDDLEWARES GLOBALES
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// --- Autenticación ---
const authRouter = express.Router();
authRouter.use(limite);
authRouter.post("/registro", authCtrl.registro);
authRouter.post("/login", authCtrl.login);
authRouter.post("/logout", cookieJwtAuth, authCtrl.logout);
app.use("/api/auth", authRouter);

// --- Usuario ---
const userRouter = express.Router();
userRouter.use(cookieJwtAuth, limite);
userRouter.get("/me", userCtrl.obtenerPerfil);
userRouter.patch("/me", userCtrl.actualizarPerfil);
userRouter.post("/me/password", userCtrl.cambiarContraseña);
app.use("/api/user", userRouter);

// --- Vehículos ---
const vehicleRouter = express.Router();
vehicleRouter.use(limite);
vehicleRouter.post("/create", cookieJwtAuth, vehicleCtrl.registrarVehiculo);
vehicleRouter.get("/types", vehicleCtrl.obtenerTiposVehiculos);
vehicleRouter.get("/me", cookieJwtAuth, vehicleCtrl.obtenerMisVehiculos);
vehicleRouter.get("/:id", cookieJwtAuth, vehicleCtrl.obtenerVehiculo);
vehicleRouter.patch("/:id", cookieJwtAuth, vehicleCtrl.actualizarVehiculo);
vehicleRouter.delete("/:id", cookieJwtAuth, vehicleCtrl.eliminarVehiculo);
app.use("/api/vehicle", vehicleRouter);

// --- Tarifas ---
const rateRouter = express.Router();
rateRouter.use(limite);
rateRouter.get("/rates", rateCtrl.obtenerTodasTarifas);
rateRouter.get("/rates/:id", rateCtrl.obtenerTarifaPorId);
rateRouter.get("/vehicle/:tipo_vehiculo_id", rateCtrl.obtenerTarifaPorTipo);
app.use("/api/rate", rateRouter);

// --- Reservas ---
const bookingRouter = express.Router();
bookingRouter.use(cookieJwtAuth, limite);
bookingRouter.post("/create", bookingCtrl.crearReserva);
bookingRouter.get("/me", bookingCtrl.obtenerHistorialReservasUsuario);
app.use("/api/booking", bookingRouter);

// --- Pagos ---
const paymentRouter = express.Router();
paymentRouter.use(cookieJwtAuth, limite);
paymentRouter.post("/validate", paymentCtrl.validarPago);
app.use("/api/payment", paymentRouter);

// --- Servicios ---
const serviceRouter = express.Router();
serviceRouter.use(limite);
serviceRouter.get("/services", serviceCtrl.obtenerServicios);
app.use("/api/service", serviceRouter);

// --- Contacto ---
const contactRouter = express.Router();
contactRouter.use(limite);
contactRouter.post("/", contactCtrl.enviarContacto);
app.use("/api/contact", contactRouter);

// 6. MANEJO DE ERRORES
app.use(notFound);
app.use(errorHandler);

module.exports = app;