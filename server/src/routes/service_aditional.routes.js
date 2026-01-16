const express = require("express");
const router = express.Router();
const { param, query } = require("express-validator");
const ServiceAditionalController = require("../controllers/service_aditional.controller");

// Obtener todas las tarifas
router.get("/servicios_adicionales", ServiceAditionalController.serviceAditionals);

module.exports = router;

