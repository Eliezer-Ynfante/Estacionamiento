const db = require('../models');
const { Op } = require('sequelize');
const Tarifa = db.Tarifa;

exports.tarifas = async (req, res) => {
    try {
        const tarifas = await Tarifa.findAll({
            attributes: ['tarifa_id', 'nombre', 'precio_hora', 'precio_dia', 'precio_semana', 'descripcion'],
            order: [['tarifa_id', 'ASC']]
        });

        if (tarifas.length === 0) {
            return res.status(404).json({ 
                message: 'No tarifas found',
                data: [] 
            });
        }

        res.status(200).json(tarifas);
    } catch (error) {
        console.error('Error retrieving tarifas:', error);
        res.status(500).json({ 
            message: 'Error retrieving tarifas', 
            error: error.message 
        });
    }
};

