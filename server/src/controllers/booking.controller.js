const { z } = require('zod');
const { Op } = require('sequelize');
const {
  Reserva,
  Pago,
  Plaza,
  Tarifa,
  HistorialPlaza,
  Vehiculo,
  Servicio,
  Usuario
} = require('../models');
const { crearReservaSchema } = require('../schemas/reservaSchema');

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================

const calcularMontoTotal = (tarifa, fecha_inicio, fecha_fin, servicio_precio = 0) => {
  const inicio = new Date(fecha_inicio);
  const fin = new Date(fecha_fin);
  const diferenciaMs = fin - inicio;

  const horas = diferenciaMs / (1000 * 60 * 60);
  const dias = Math.floor(horas / 24);
  const horasRestantes = horas % 24;
  const semanas = Math.floor(dias / 7);
  const diasRestantes = dias % 7;

  let monto = 0;

  if (semanas > 0) {
    monto += parseFloat(tarifa.precio_semana) * semanas;
  }

  if (diasRestantes > 0) {
    if (diasRestantes >= 4) {
      monto += parseFloat(tarifa.precio_dia) * diasRestantes;
    } else {
      monto += parseFloat(tarifa.precio_hora) * (diasRestantes * 24);
    }
  }

  if (horasRestantes > 0) {
    monto += parseFloat(tarifa.precio_hora) * Math.ceil(horasRestantes);
  }

  return parseFloat((monto + servicio_precio).toFixed(2));
};

const validarDisponibilidadPlaza = async (plaza_id, fecha_inicio, fecha_fin) => {
  const conflictos = await HistorialPlaza.findAll({
    where: {
      plaza_id,
      [Op.or]: [
        {
          fecha_inicio: { [Op.lte]: new Date(fecha_fin) },
          fecha_fin: { [Op.gte]: new Date(fecha_inicio) }
        }
      ]
    }
  });

  return conflictos.length === 0;
};

const obtenerPlazaDisponible = async (tipo_vehiculo_id, fecha_inicio, fecha_fin) => {
  const plazasDelTipo = await Plaza.findAll({
    where: { tipo_vehiculo_id, activo: true },
    attributes: ['id', 'codigo']
  });

  if (plazasDelTipo.length === 0) return null;

  const plazasDisponibles = [];

  for (const plaza of plazasDelTipo) {
    const disponible = await validarDisponibilidadPlaza(plaza.id, fecha_inicio, fecha_fin);
    if (disponible) {
      plazasDisponibles.push({ id: plaza.id, codigo: plaza.codigo });
    }
  }

  if (plazasDisponibles.length === 0) return null;

  return plazasDisponibles[Math.floor(Math.random() * plazasDisponibles.length)];
};

const generarCodigoReserva = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};


// =====================================================
// CONTROLADOR: CREAR RESERVA
// =====================================================

exports.crearReserva = async (req, res) => {
  try {
    // CORRECCIÓN APLICADA: req.user.id
    const validacion = crearReservaSchema.safeParse({
      ...req.body,
      usuario_id: req.user.id
    });

    if (!validacion.success) {
      console.error('Error de validación en crearReserva:', validacion.error.issues);
      console.error('Datos recibidos:', req.body);
      return res.status(400).json({
        success: false,
        errores: validacion.error.issues.map(err => ({
          campo: err.path.join('.'),
          mensaje: err.message
        }))
      });
    }

    const datosValidados = validacion.data;
    const fecha_inicio = new Date(datosValidados.fecha_hora_inicio);
    const fecha_fin = new Date(datosValidados.fecha_hora_fin);

    const usuario = await Usuario.findByPk(datosValidados.usuario_id);

    if (!usuario) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    if (!usuario.activo) {
      return res.status(403).json({ success: false, error: 'Tu cuenta ha sido desactivada' });
    }

    const vehiculo = await Vehiculo.findByPk(datosValidados.vehiculo_id, {
      include: [{ association: 'tipo', attributes: ['id', 'nombre'] }]
    });

    if (!vehiculo) {
      return res.status(404).json({ success: false, error: 'Vehículo no encontrado' });
    }

    if (vehiculo.usuario_id !== datosValidados.usuario_id) {
      return res.status(403).json({ success: false, error: 'El vehículo no pertenece al usuario autenticado' });
    }

    const plaza = await obtenerPlazaDisponible(
      vehiculo.tipo_vehiculo_id,
      fecha_inicio,
      fecha_fin
    );

    if (!plaza) {
      return res.status(409).json({
        success: false,
        error: `No hay plazas disponibles para ${vehiculo.tipo.nombre} en las fechas seleccionadas`,
        tipo_vehiculo: vehiculo.tipo.nombre,
        fecha_inicio,
        fecha_fin
      });
    }

    const tarifa = await Tarifa.findOne({
      where: { tipo_vehiculo_id: vehiculo.tipo_vehiculo_id }
    });

    if (!tarifa) {
      return res.status(404).json({ success: false, error: 'No hay tarifa configurada para este tipo de vehículo' });
    }

    let servicio_precio = 0;
    if (datosValidados.servicio_id) {
      const servicio = await Servicio.findByPk(datosValidados.servicio_id);
      if (!servicio) {
        return res.status(404).json({ success: false, error: 'Servicio no encontrado' });
      }
      servicio_precio = parseFloat(servicio.precio);
    }

    const monto_total = calcularMontoTotal(tarifa, fecha_inicio, fecha_fin, servicio_precio);
    const codigo = generarCodigoReserva();

    // Crear reserva en estado CONFIRMADA (el pago ya fue validado)
    const nuevaReserva = await Reserva.create({
      codigo,
      usuario_id: datosValidados.usuario_id,
      plaza_id: plaza.id,
      vehiculo_id: datosValidados.vehiculo_id,
      servicio_id: datosValidados.servicio_id || null,
      fecha_hora_inicio: fecha_inicio,
      fecha_hora_fin: fecha_fin,
      monto_total,
      estado: 'confirmada'
    });

    // Crear historial de plaza
    await HistorialPlaza.create({
      plaza_id: plaza.id,
      fecha_inicio,
      fecha_fin,
      reserva_id: nuevaReserva.id
    });

    // Crear registro de pago con estado PAGADO (porque ya fue validado)
    await Pago.create({
      reserva_id: nuevaReserva.id,
      monto: monto_total,
      metodo_pago: 'tarjeta',
      estado: 'pagado',
      fecha_pago: new Date()
    });

    const reservaConDetalle = await Reserva.findByPk(nuevaReserva.id, {
      include: [
        { association: 'usuario', attributes: ['id', 'nombre', 'correo_electronico'] },
        { association: 'plaza', attributes: ['id', 'codigo'] },
        {
          association: 'vehiculo',
          attributes: ['id', 'placa', 'marca', 'color', 'año'],
          include: [{ association: 'tipo', attributes: ['id', 'nombre'] }]
        },
        { association: 'servicio', attributes: ['id', 'nombre', 'precio'] },
        { association: 'pago', attributes: ['id', 'monto', 'metodo_pago', 'estado', 'fecha_pago'] }
      ]
    });

    const duracionMs = fecha_fin - fecha_inicio;
    const horas = Math.round((duracionMs / (1000 * 60 * 60)) * 100) / 100;
    const dias = Math.round((horas / 24) * 100) / 100;

    return res.status(201).json({
      success: true,
      mensaje: 'Reserva creada exitosamente',
      data: {
        ...reservaConDetalle.toJSON(),
        duracion: { horas, dias },
        tarifa: {
          precio_hora: parseFloat(tarifa.precio_hora),
          precio_dia: parseFloat(tarifa.precio_dia),
          precio_semana: parseFloat(tarifa.precio_semana)
        }
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errores: error.issues.map(err => ({
          campo: err.path.join('.'),
          mensaje: err.message
        }))
      });
    }

    console.error('Error al crear reserva:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// =====================================================
// CONTROLADOR: HISTORIAL DE RESERVAS DE USUARIO
// =====================================================

exports.obtenerHistorialReservasUsuario = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const reservas = await Reserva.findAll({
      where: { usuario_id },
      include: [
        { association: 'plaza', attributes: ['id', 'codigo'] },
        {
          association: 'vehiculo',
          attributes: ['id', 'placa', 'marca', 'color', 'año'],
          include: [{ association: 'tipo', attributes: ['id', 'nombre'] }]
        },
        { association: 'servicio', attributes: ['id', 'nombre', 'precio'] },
        { association: 'pago', attributes: ['id', 'monto', 'metodo_pago', 'estado', 'fecha_pago'] }
      ]
    });

    return res.status(200).json({
      success: true,
      data: reservas
    });
  } catch (error) {
    console.error('Error al obtener historial de reservas:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};