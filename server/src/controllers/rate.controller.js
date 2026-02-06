const { z } = require('zod');
const { Tarifa, TipoVehiculo } = require('../models');

// =====================================================
// OBTENER TODAS LAS TARIFAS
// =====================================================
exports.obtenerTodasTarifas = async (req, res) => {
  try {
    // 1. OBTENER TODAS LAS TARIFAS CON INFORMACIÓN DEL TIPO
    const tarifas = await Tarifa.findAll({
      include: [
        {
          association: 'tipo',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['tipo_vehiculo_id', 'ASC']]
    });

    // 2. SI NO HAY TARIFAS
    if (tarifas.length === 0) {
      return res.status(200).json({
        success: true,
        mensaje: 'No hay tarifas registradas',
        data: []
      });
    }

    // 3. RESPONDER
    return res.status(200).json({
      success: true,
      cantidad: tarifas.length,
      data: tarifas
    });

  } catch (error) {
    console.error('Error al obtener tarifas:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// =====================================================
// OBTENER TARIFA POR ID
// =====================================================
exports.obtenerTarifaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. VALIDAR QUE EL ID SEA UN NÚMERO
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'El ID debe ser un número válido'
      });
    }

    // 2. BUSCAR TARIFA
    const tarifa = await Tarifa.findByPk(id, {
      include: [
        {
          association: 'tipo',
          attributes: ['id', 'nombre']
        }
      ]
    });

    // 3. VERIFICAR QUE EXISTA
    if (!tarifa) {
      return res.status(404).json({
        success: false,
        error: 'Tarifa no encontrada'
      });
    }

    // 4. RESPONDER
    return res.status(200).json({
      success: true,
      data: tarifa
    });

  } catch (error) {
    console.error('Error al obtener tarifa:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// =====================================================
// OBTENER TARIFA POR TIPO DE VEHÍCULO
// =====================================================
exports.obtenerTarifaPorTipo = async (req, res) => {
  try {
    const { tipo_vehiculo_id } = req.params;

    // 1. VALIDAR QUE EL TIPO_VEHICULO_ID SEA UN NÚMERO
    if (isNaN(tipo_vehiculo_id)) {
      return res.status(400).json({
        success: false,
        error: 'El tipo_vehiculo_id debe ser un número válido'
      });
    }

    // 2. VERIFICAR QUE EL TIPO DE VEHÍCULO EXISTA
    const tipoVehiculo = await TipoVehiculo.findByPk(tipo_vehiculo_id);

    if (!tipoVehiculo) {
      return res.status(404).json({
        success: false,
        error: 'El tipo de vehículo no existe'
      });
    }

    // 3. BUSCAR TARIFA POR TIPO DE VEHÍCULO
    const tarifa = await Tarifa.findOne({
      where: { tipo_vehiculo_id },
      include: [
        {
          association: 'tipo',
          attributes: ['id', 'nombre']
        }
      ]
    });

    // 4. VERIFICAR QUE EXISTA
    if (!tarifa) {
      return res.status(404).json({
        success: false,
        error: `No hay tarifa registrada para el tipo: ${tipoVehiculo.nombre}`
      });
    }

    // 5. RESPONDER
    return res.status(200).json({
      success: true,
      data: tarifa
    });

  } catch (error) {
    console.error('Error al obtener tarifa por tipo:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};