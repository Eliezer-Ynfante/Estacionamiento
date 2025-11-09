const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../models');

const Usuario = db.Usuario;

// Registro de usuario
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { nombre, email, telefono, password, rol_id } = req.body;

    // Verificar si email ya existe
    const existing = await Usuario.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email ya registrado' });
    }

    // Hashear contraseña
    const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const newUser = await Usuario.create({
      nombre,
      email,
      telefono,
      hash_contrasena: hashed,
      rol_id: rol_id || 2 // por defecto rol 2 (puedes ajustar según tus roles)
    });

    return res.status(201).json({
      success: true,
      data: {
        usuario_id: newUser.usuario_id,
        nombre: newUser.nombre,
        email: newUser.email
      }
    });
  } catch (err) {
    next(err);
  }
};
