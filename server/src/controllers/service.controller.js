const { Servicio } = require('../models');

// =====================================================
// OBTENER TODOS LOS SERVICIOS
// =====================================================

exports.obtenerServicios = async (req, res) => {
    try {
        const servicios = await Servicio.findAll({
            attributes: ['id', 'nombre', 'precio', 'descripcion']
        });

        if (servicios.length === 0) {
            return res.status(200).json({
                success: true,
                mensaje: 'No hay servicios registrados',
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            cantidad: servicios.length,
            data: servicios
        });

    } catch (error) {
        console.error('Error al obtener los servicios:', error);
        return res.status(500).json({
            success: false, 
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
}