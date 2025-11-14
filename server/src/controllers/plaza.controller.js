const db = require('../models');
const { Op } = require('sequelize');

const Plaza = db.Plaza;
const Reserva = db.Reserva;
const Tarifa = db.Tarifa;

// Obtener todas las plazas clasificadas por estado
exports.plazas = async (req, res, next) => {
    try {
        const ahora = new Date();

        // Obtener todas las plazas con sus tarifas
        const todasPlazas = await Plaza.findAll({
            include: [{
                model: Tarifa,
                required: true,
                attributes: ['tarifa_id', 'nombre', 'precio_hora', 'precio_dia', 'precio_semana']
            }],
            order: [['numero_plaza', 'ASC']]
        });

        // Obtener reservas activas (confirmadas y en el rango de fechas actual)
        const reservasActivas = await Reserva.findAll({
            where: {
                estado: {
                    [Op.in]: ['confirmada', 'activa']
                },
                fecha_hora_inicio: {
                    [Op.lte]: ahora
                },
                fecha_hora_fin: {
                    [Op.gte]: ahora
                }
            },
            attributes: ['reserva_id', 'plaza_id', 'fecha_hora_inicio', 'fecha_hora_fin']
        });

        // Crear un Set con los IDs de plazas reservadas
        const plazasReservadasIds = new Set(
            reservasActivas.map(reserva => reserva.plaza_id)
        );

        // Clasificar las plazas
        const plazasDisponibles = [];
        const plazasReservadas = [];
        const plazasInactivas = [];

        todasPlazas.forEach(plaza => {
            const plazaData = {
                plaza_id: plaza.plaza_id,
                numero_plaza: plaza.numero_plaza,
                tipo: plaza.tipo,
                esta_activa: plaza.esta_activa,
                tarifa: {
                    tarifa_id: plaza.Tarifa.tarifa_id,
                    nombre: plaza.Tarifa.nombre,
                    precio_hora: parseFloat(plaza.Tarifa.precio_hora),
                    precio_dia: parseFloat(plaza.Tarifa.precio_dia),
                    precio_semana: parseFloat(plaza.Tarifa.precio_semana)
                },
                estado: ''
            };

            // Clasificar según estado
            if (!plaza.esta_activa) {
                plazaData.estado = 'inactiva';
                plazasInactivas.push(plazaData);
            } else if (plazasReservadasIds.has(plaza.plaza_id)) {
                plazaData.estado = 'reservada';
                // Añadir información de la reserva activa
                const reservaActual = reservasActivas.find(r => r.plaza_id === plaza.plaza_id);
                plazaData.reserva_actual = {
                    reserva_id: reservaActual.reserva_id,
                    fecha_hora_inicio: reservaActual.fecha_hora_inicio,
                    fecha_hora_fin: reservaActual.fecha_hora_fin
                };
                plazasReservadas.push(plazaData);
            } else {
                plazaData.estado = 'disponible';
                plazasDisponibles.push(plazaData);
            }
        });

        // Respuesta estructurada
        res.status(200).json({
            success: true,
            total: todasPlazas.length,
            resumen: {
                disponibles: plazasDisponibles.length,
                reservadas: plazasReservadas.length,
                inactivas: plazasInactivas.length
            },
            plazas: {
                disponibles: plazasDisponibles,
                reservadas: plazasReservadas,
                inactivas: plazasInactivas
            },
            todas: todasPlazas.map(plaza => ({
                plaza_id: plaza.plaza_id,
                numero_plaza: plaza.numero_plaza,
                tipo: plaza.tipo,
                esta_activa: plaza.esta_activa,
                estado: !plaza.esta_activa ? 'inactiva' : 
                        plazasReservadasIds.has(plaza.plaza_id) ? 'reservada' : 'disponible',
                tarifa: {
                    tarifa_id: plaza.Tarifa.tarifa_id,
                    nombre: plaza.Tarifa.nombre,
                    precio_hora: parseFloat(plaza.Tarifa.precio_hora),
                    precio_dia: parseFloat(plaza.Tarifa.precio_dia),
                    precio_semana: parseFloat(plaza.Tarifa.precio_semana)
                }
            }))
        });

    } catch (error) {
        console.error('Error al listar las plazas:', error);
        res.status(500).json({ 
            success: false,
            mensaje: 'Error al listar las plazas', 
            error: error.message 
        });
    }
};

// Obtener solo plazas disponibles (útil para el formulario de reserva)
exports.plazas_diponibles = async (req, res, next) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        const ahora = new Date();

        // Si no se proporcionan fechas, usar el momento actual
        const fechaInicio = fecha_inicio ? new Date(fecha_inicio) : ahora;
        const fechaFin = fecha_fin ? new Date(fecha_fin) : new Date(ahora.getTime() + 3600000); // +1 hora

        // Validar fechas
        if (fechaFin <= fechaInicio) {
            return res.status(400).json({
                success: false,
                mensaje: 'La fecha de fin debe ser posterior a la fecha de inicio'
            });
        }

        // Obtener plazas activas
        const plazasActivas = await Plaza.findAll({
            where: {
                esta_activa: true
            },
            include: [{
                model: Tarifa,
                required: true,
                attributes: ['tarifa_id', 'nombre', 'precio_hora', 'precio_dia', 'precio_semana']
            }],
            order: [['numero_plaza', 'ASC']]
        });

        // Obtener reservas que se solapan con el rango de fechas solicitado
        const reservasConflicto = await Reserva.findAll({
            where: {
                estado: {
                    [Op.in]: ['pendiente', 'confirmada', 'activa']
                },
                [Op.or]: [
                    {
                        fecha_hora_inicio: {
                            [Op.between]: [fechaInicio, fechaFin]
                        }
                    },
                    {
                        fecha_hora_fin: {
                            [Op.between]: [fechaInicio, fechaFin]
                        }
                    },
                    {
                        [Op.and]: [
                            {
                                fecha_hora_inicio: {
                                    [Op.lte]: fechaInicio
                                }
                            },
                            {
                                fecha_hora_fin: {
                                    [Op.gte]: fechaFin
                                }
                            }
                        ]
                    }
                ]
            },
            attributes: ['plaza_id']
        });

        // IDs de plazas no disponibles
        const plazasNoDisponiblesIds = new Set(
            reservasConflicto.map(reserva => reserva.plaza_id)
        );

        // Filtrar solo plazas disponibles
        const plazasDisponibles = plazasActivas.filter(
            plaza => !plazasNoDisponiblesIds.has(plaza.plaza_id)
        );

        res.status(200).json({
            success: true,
            periodo_consultado: {
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            },
            total_disponibles: plazasDisponibles.length,
            plazas: plazasDisponibles.map(plaza => ({
                plaza_id: plaza.plaza_id,
                numero_plaza: plaza.numero_plaza,
                tipo: plaza.tipo,
                tarifa: {
                    tarifa_id: plaza.Tarifa.tarifa_id,
                    nombre: plaza.Tarifa.nombre,
                    precio_hora: parseFloat(plaza.Tarifa.precio_hora),
                    precio_dia: parseFloat(plaza.Tarifa.precio_dia),
                    precio_semana: parseFloat(plaza.Tarifa.precio_semana)
                }
            }))
        });

    } catch (error) {
        console.error('Error al obtener plazas disponibles:', error);
        res.status(500).json({ 
            success: false,
            mensaje: 'Error al obtener plazas disponibles', 
            error: error.message 
        });
    }
};

// Obtener detalle de una plaza específica
exports.detalle_plaza = async (req, res) => {
    try {
        const { plaza_id } = req.params;
        const ahora = new Date();

        const plaza = await Plaza.findByPk(plaza_id, {
            include: [{
                model: Tarifa,
                required: true,
                attributes: ['tarifa_id', 'nombre', 'precio_hora', 'precio_dia', 'precio_semana']
            }]
        });

        if (!plaza) {
            return res.status(404).json({
                success: false,
                mensaje: 'Plaza no encontrada'
            });
        }

        // Verificar si tiene reserva activa
        const reservaActiva = await Reserva.findOne({
            where: {
                plaza_id: plaza_id,
                estado: {
                    [Op.in]: ['confirmada', 'activa']
                },
                fecha_hora_inicio: {
                    [Op.lte]: ahora
                },
                fecha_hora_fin: {
                    [Op.gte]: ahora
                }
            },
            attributes: ['reserva_id', 'fecha_hora_inicio', 'fecha_hora_fin', 'estado']
        });

        // Obtener próximas reservas (las siguientes 5)
        const proximasReservas = await Reserva.findAll({
            where: {
                plaza_id: plaza_id,
                estado: 'confirmada',
                fecha_hora_inicio: {
                    [Op.gt]: ahora
                }
            },
            order: [['fecha_hora_inicio', 'ASC']],
            limit: 5,
            attributes: ['reserva_id', 'fecha_hora_inicio', 'fecha_hora_fin']
        });

        // Determinar estado
        let estado = 'disponible';
        if (!plaza.esta_activa) {
            estado = 'inactiva';
        } else if (reservaActiva) {
            estado = 'reservada';
        }

        res.status(200).json({
            success: true,
            plaza: {
                plaza_id: plaza.plaza_id,
                numero_plaza: plaza.numero_plaza,
                tipo: plaza.tipo,
                esta_activa: plaza.esta_activa,
                estado: estado,
                tarifa: {
                    tarifa_id: plaza.Tarifa.tarifa_id,
                    nombre: plaza.Tarifa.nombre,
                    precio_hora: parseFloat(plaza.Tarifa.precio_hora),
                    precio_dia: parseFloat(plaza.Tarifa.precio_dia),
                    precio_semana: parseFloat(plaza.Tarifa.precio_semana)
                },
                reserva_actual: reservaActiva || null,
                proximas_reservas: proximasReservas
            }
        });

    } catch (error) {
        console.error('Error al obtener detalle de plaza:', error);
        res.status(500).json({ 
            success: false,
            mensaje: 'Error al obtener detalle de plaza', 
            error: error.message 
        });
    }
};