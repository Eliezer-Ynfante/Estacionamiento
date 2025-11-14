const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { Op } = require('sequelize');

const Usuario = db.Usuario;
const Pago = db.Pago;
const Reserva = db.Reserva;
const Plaza = db.Plaza;
const Vehiculo = db.Vehiculo;
const Tarifa = db.Tarifa;


// Generar token basado en los datos de la tarjeta
function tokenCard(datosCard) {
    try {
        const payload = {
            card_last4: datosCard.card.slice(-4),
            fecha_expire: datosCard.fecha_expire,
            timestamp: Date.now()
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secreto', {
            expiresIn: '5m',
        });

        return token;
    } catch (err) {
        console.error('Error al generar el token:', err);
        throw new Error('Error al generar el token');
    }
}

// Simular procesamiento de pago
async function simularProcesadorPago(datosPago) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const exito = Math.random() > 0.1; // 90% de éxito

    return {
        exito,
        transaccion_id: exito ? `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : null,
        mensaje: exito ? 'Pago procesado exitosamente' : 'Pago rechazado por el procesador'
    };
}

// Calcular costo de la reserva
function calcularCosto(tarifa, fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferenciaMs = fin - inicio;
    const horas = diferenciaMs / (1000 * 60 * 60);
    const dias = Math.floor(horas / 24);
    const horasRestantes = horas % 24;

    let costoTotal = 0;

    if (dias > 0) {
        costoTotal += dias * tarifa.precio_dia;
    }

    if (horasRestantes > 0) {
        costoTotal += Math.ceil(horasRestantes) * tarifa.precio_hora;
    }

    return parseFloat(costoTotal.toFixed(2));
}

// CREAR RESERVA Y PROCESAR PAGO (Transacción completa)
exports.crearReservaYPagar = [
    async (req, res, next) => {
        // Iniciar transacción
        const transaction = await db.sequelize.transaction();

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                await transaction.rollback();
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const {
                plaza_id,
                vehiculo_id,
                fecha_hora_inicio,
                fecha_hora_fin,
                card,
                cvv,
                fecha_expire
            } = req.body;

            const usuario_id = req.session.userId;

            // 1. Verificar que el usuario existe
            const usuario = await Usuario.findByPk(usuario_id, { transaction });
            if (!usuario) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // 2. Verificar que el vehículo pertenece al usuario
            const vehiculo = await Vehiculo.findOne({
                where: {
                    vehiculo_id: vehiculo_id,
                    usuario_id: usuario_id
                },
                transaction
            });

            if (!vehiculo) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'Vehículo no encontrado o no autorizado'
                });
            }

            // 3. Verificar que la plaza existe y está activa
            const plaza = await Plaza.findOne({
                where: {
                    plaza_id: plaza_id,
                    esta_activa: true
                },
                include: [{
                    model: Tarifa,
                    required: true
                }],
                transaction
            });

            if (!plaza) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'Plaza no disponible o no existe'
                });
            }

            // 4. Verificar que la plaza no tenga reservas activas en ese periodo
            const reservasConflicto = await Reserva.findOne({
                where: {
                    plaza_id: plaza_id,
                    estado: ['pendiente', 'confirmada', 'activa'],
                    [Op.or]: [
                        { fecha_hora_inicio: { [Op.between]: [fecha_hora_inicio, fecha_hora_fin] } },
                        { fecha_hora_fin: { [Op.between]: [fecha_hora_inicio, fecha_hora_fin] } },
                        {
                            [Op.and]: [{ fecha_hora_inicio: { [Op.lte]: fecha_hora_inicio } },
                            { fecha_hora_fin: { [Op.gte]: fecha_hora_fin } }]
                        }
                    ]
                },
                transaction
            });

            if (reservasConflicto) {
                await transaction.rollback();
                return res.status(409).json({
                    success: false,
                    message: 'La plaza ya está reservada en ese horario'
                });
            }

            // 5. Validar fechas
            const ahora = new Date();
            const inicio = new Date(fecha_hora_inicio);
            const fin = new Date(fecha_hora_fin);

            if (inicio < ahora) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'La fecha de inicio no puede ser en el pasado'
                });
            }

            if (fin <= inicio) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'La fecha de fin debe ser posterior a la fecha de inicio'
                });
            }

            // 6. Calcular costo de la reserva
            const costoTotal = calcularCosto(plaza.Tarifa, fecha_hora_inicio, fecha_hora_fin);

            if (costoTotal <= 0) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'Error al calcular el costo de la reserva'
                });
            }

            // 7. Crear la reserva
            const nuevaReserva = await Reserva.create({
                usuario_id: usuario_id,
                plaza_id: plaza_id,
                vehiculo_id: vehiculo_id,
                fecha_hora_inicio: fecha_hora_inicio,
                fecha_hora_fin: fecha_hora_fin,
                estado: 'pendiente',
                costo_total: costoTotal
            }, { transaction });

            // 8. Procesar el pago
            const resultadoPago = await simularProcesadorPago({
                usuario_id: usuario_id,
                monto: costoTotal,
                card: card.slice(-4)
            });

            // 9. Crear registro del pago
            const nuevoPago = await Pago.create({
                reserva_id: nuevaReserva.reserva_id,
                monto: costoTotal,
                metodo: 'tarjeta',
                estado_pago: resultadoPago.exito ? 'completado' : 'rechazado',
                fecha_pago: new Date()
            }, { transaction });

            // 10. Si el pago fue exitoso, confirmar la reserva
            if (resultadoPago.exito) {
                await nuevaReserva.update({
                    estado: 'confirmada'
                }, { transaction });

                // Generar token
                const token = tokenCard({ card, fecha_expire });

                // Confirmar transacción
                await transaction.commit();

                return res.status(200).json({
                    success: true,
                    message: 'Reserva creada y pago procesado exitosamente',
                    reserva: {
                        numero_plaza: plaza.numero_plaza,
                        vehiculo_placa: vehiculo.placa,
                        fecha_hora_inicio: nuevaReserva.fecha_hora_inicio,
                        fecha_hora_fin: nuevaReserva.fecha_hora_fin,
                        estado: nuevaReserva.estado,
                        costo_total: nuevaReserva.costo_total_calculado
                    },
                    pago: {
                        monto: nuevoPago.monto,
                        metodo: nuevoPago.metodo,
                        estado_pago: nuevoPago.estado_pago,
                        fecha_pago: nuevoPago.fecha_pago,
                        transaccion_id: resultadoPago.transaccion_id
                    },
                    token: token
                });

            } else {
                // Si el pago falló, cancelar la reserva
                await nuevaReserva.update({
                    estado: 'cancelada'
                }, { transaction });

                await transaction.commit();

                return res.status(402).json({
                    success: false,
                    message: resultadoPago.mensaje,
                    reserva: {
                        reserva_id: nuevaReserva.reserva_id,
                        estado: 'cancelada'
                    },
                    pago: {
                        pago_id: nuevoPago.pago_id,
                        estado_pago: nuevoPago.estado_pago
                    }
                });
            }

        } catch (error) {
            await transaction.rollback();
            console.error('Error en proceso de reserva y pago:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
];

// Historial de reservas y pagos del usuario
exports.historial = [
    async (req, res) => {
        try {
            const usuario_id = req.session.userId;

            const reservas = await Reserva.findAll({
                where: { usuario_id: usuario_id },
                attributes: [
                    'reserva_id',
                    'fecha_hora_inicio',
                    'fecha_hora_fin',
                    'estado',
                    'costo_total',
                    'fecha_creacion'
                ],
                include: [
                    {
                        model: Usuario,
                        attributes: ['nombre', 'email', 'telefono']
                    },
                    {
                        model: Plaza,
                        attributes: ['numero_plaza', 'tipo']
                    },
                    {
                        model: Vehiculo,
                        attributes: ['placa', 'marca', 'color']
                    },
                    {
                        model: Pago,
                        attributes: ['monto', 'metodo', 'estado_pago', 'fecha_pago']
                    }
                ],
                order: [['fecha_creacion', 'DESC']]
            });


            return res.status(200).json({
                success: true,
                total: reservas.length,
                reservas
            });
        } catch (error) {
            console.error('Error al obtener historial:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
];

// Verificar estado de una reserva específica
exports.verificarReserva = [
    async (req, res, next) => {
        try {
            const { reserva_id } = req.params;
            const usuario_id = req.session.userId;

            const reserva = await Reserva.findOne({
                where: {
                    reserva_id: reserva_id,
                    usuario_id: usuario_id
                },
                include: [
                    {
                        model: Plaza,
                        attributes: ['plaza_id', 'numero_plaza', 'tipo']
                    },
                    {
                        model: Vehiculo,
                        attributes: ['vehiculo_id', 'placa', 'marca', 'color']
                    },
                    {
                        model: Pago,
                        attributes: ['pago_id', 'monto', 'metodo', 'estado_pago', 'fecha_pago']
                    }
                ]
            });

            if (!reserva) {
                return res.status(404).json({
                    success: false,
                    message: 'Reserva no encontrada o no autorizada'
                });
            }

            return res.status(200).json({
                success: true,
                reserva
            });

        } catch (error) {
            console.error('Error al verificar reserva:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al verificar la reserva'
            });
        }
    }
];

// Cancelar reserva (solo si está pendiente o confirmada)
exports.cancelarReserva = [
    async (req, res) => {
        try {
            const { reserva_id } = req.params;
            const usuario_id = req.session.userId;

            const reserva = await Reserva.findOne({
                where: {
                    reserva_id: reserva_id,
                    usuario_id: usuario_id,
                    estado: ['pendiente', 'confirmada']
                }
            });

            if (!reserva) {
                return res.status(404).json({
                    success: false,
                    message: 'Reserva no encontrada, no autorizada o no se puede cancelar'
                });
            }

            await reserva.update({ estado: 'cancelada' });

            return res.status(200).json({
                success: true,
                message: 'Reserva cancelada exitosamente',
                reserva: {
                    reserva_id: reserva.reserva_id,
                    estado: reserva.estado
                }
            });

        } catch (error) {
            console.error('Error al cancelar reserva:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al cancelar la reserva'
            });
        }
    }
];

