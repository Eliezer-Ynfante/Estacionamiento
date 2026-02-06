const { z } = require('zod');
const { Usuario, TipoVehiculo, Vehiculo } = require('../models');
const { crearVehiculoSchema } = require('../schemas/vehiculoSchema');

// =====================================================
// REGISTRAR NUEVO VEHÍCULO
// =====================================================
exports.registrarVehiculo = async (req, res) => {
    try {
        // Combinamos el body con el id del middleware ANTES de validar
        const validacion = crearVehiculoSchema.safeParse({
            ...req.body,
            usuario_id: req.user.id
        });

        if (!validacion.success) {
            return res.status(400).json({
                success: false,
                errores: validacion.error.issues.map(err => ({
                    campo: err.path.join('.'),
                    mensaje: err.message
                }))
            });
        }

        const datosValidados = validacion.data;

        const tipoVehiculo = await TipoVehiculo.findByPk(datosValidados.tipo_vehiculo_id);
        if (!tipoVehiculo) {
            return res.status(404).json({
                success: false,
                error: 'El tipo de vehiculo no existe'
            });
        }

        const vehiculoExistente = await Vehiculo.findOne({
            where: { placa: datosValidados.placa.toUpperCase() }
        });

        if (vehiculoExistente) {
            return res.status(409).json({
                success: false,
                error: 'La placa ya esta registrada'
            });
        }

        const nuevoVehiculo = await Vehiculo.create({
            ...datosValidados,
            placa: datosValidados.placa.toUpperCase()
        });

        const vehiculoConDetalle = await Vehiculo.findByPk(nuevoVehiculo.id, {
            include: [{ association: 'tipo', attributes: ['id', 'nombre'] }]
        });

        return res.status(201).json({
            success: true,
            mensaje: 'Vehículo registrado exitosamente',
            data: vehiculoConDetalle
        });

    } catch (error) {
        console.error('Error al registrar vehiculo: ', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// =====================================================
// OBTENER TODOS LOS VEHÍCULOS DEL USUARIO
// =====================================================
exports.obtenerMisVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.findAll({
            where: { usuario_id: req.user.id },
            include: [
                {
                    association: 'tipo',
                    attributes: ['id', 'nombre']
                }
            ],
            attributes: { exclude: ['usuario_id'] }
        });

        return res.status(200).json({
            success: true,
            cantidad: vehiculos.length,
            data: vehiculos
        });

    } catch (error) {
        console.error('Error al obtener vehículos:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// =====================================================
// OBTENER UN VEHÍCULO POR ID
// =====================================================
exports.obtenerVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const idNum = Number(id);

        // 1. VALIDAR QUE EL ID SEA UN NÚMERO
        if (Number.isNaN(idNum)) {
            return res.status(400).json({
                success: false,
                error: 'El ID debe ser un número válido'
            });
        }

        // 2. BUSCAR VEHÍCULO
        const vehiculo = await Vehiculo.findByPk(idNum, {
            include: [
                {
                    association: 'tipo',
                    attributes: ['id', 'nombre']
                }
            ],
            attributes: { exclude: ['usuario_id'] }
        });

        // 3. VERIFICAR QUE EXISTA
        if (!vehiculo) {
            return res.status(404).json({
                success: false,
                error: 'Vehículo no encontrado'
            });
        }

        // 4. VERIFICAR QUE EL VEHÍCULO PERTENEZCA AL USUARIO
        const userId = Number(req.user.id);
        if (vehiculo.usuario_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permiso para acceder a este vehículo'
            });
        }

        // 5. RESPONDER
        return res.status(200).json({
            success: true,
            data: vehiculo
        });

    } catch (error) {
        console.error('Error al obtener vehículo:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// =====================================================
// ACTUALIZAR VEHÍCULO
// =====================================================
exports.actualizarVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const idNum = Number(id);
        const { marca, color, año, tipo_vehiculo_id } = req.body;

        if (Number.isNaN(idNum)) {
            return res.status(400).json({
                success: false,
                error: 'El ID debe ser un número válido'
            });
        }

        const vehiculo = await Vehiculo.findByPk(idNum);

        if (!vehiculo) {
            return res.status(404).json({
                success: false,
                error: 'Vehículo no encontrado'
            });
        }

        const userId = Number(req.user.id);
        if (vehiculo.usuario_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permiso para actualizar este vehículo'
            });
        }

        if (tipo_vehiculo_id && tipo_vehiculo_id !== vehiculo.tipo_vehiculo_id) {
            const tipoExiste = await TipoVehiculo.findByPk(tipo_vehiculo_id);
            if (!tipoExiste) {
                return res.status(404).json({
                    success: false,
                    error: 'El tipo de vehículo no existe'
                });
            }
        }

        await vehiculo.update({
            marca: marca || vehiculo.marca,
            color: color || vehiculo.color,
            año: año || vehiculo.año,
            tipo_vehiculo_id: tipo_vehiculo_id || vehiculo.tipo_vehiculo_id
        });

        const vehiculoActualizado = await Vehiculo.findByPk(idNum, {
            include: [{ association: 'tipo', attributes: ['id', 'nombre'] }],
            attributes: { exclude: ['usuario_id'] }
        });

        return res.status(200).json({
            success: true,
            mensaje: 'Vehículo actualizado exitosamente',
            data: vehiculoActualizado
        });

    } catch (error) {
        console.error('Error al actualizar vehículo:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};
// =====================================================
// ELIMINAR VEHÍCULO
// =====================================================
exports.eliminarVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const idNum = Number(id);

        if (Number.isNaN(idNum)) {
            return res.status(400).json({
                success: false,
                error: 'El ID debe ser un número válido'
            });
        }

        const vehiculo = await Vehiculo.findByPk(idNum);

        if (!vehiculo) {
            return res.status(404).json({
                success: false,
                error: 'Vehículo no encontrado'
            });
        }

        const userId = Number(req.user.id);
        if (vehiculo.usuario_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permiso para eliminar este vehículo'
            });
        }

        await vehiculo.destroy();

        return res.status(200).json({
            success: true,
            mensaje: 'Vehículo eliminado exitosamente'
        });

    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                success: false,
                error: 'No puedes eliminar este vehículo porque tiene registros asociados'
            });
        }

        console.error('Error al eliminar vehículo:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// =====================================================
// OBTENER TIPOS DE VEHÍCULOS DISPONIBLES
// =====================================================
exports.obtenerTiposVehiculos = async (req, res) => {
    try {
        const tiposVehiculos = await TipoVehiculo.findAll({
            attributes: ['id', 'nombre'],
            order: [['nombre', 'ASC']]
        });

        return res.status(200).json({
            success: true,
            cantidad: tiposVehiculos.length,
            data: tiposVehiculos
        });

    } catch (error) {
        console.error('Error al obtener tipos de vehículos:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

