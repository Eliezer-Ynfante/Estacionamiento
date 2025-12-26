const express = require("express");
const router = express.Router();
const { param, query } = require("express-validator");
const TarifaController = require("../controllers/tarifa.controller");

// Obtener todas las tarifas
router.get("/tarifas", TarifaController.tarifas);

module.exports = router;
