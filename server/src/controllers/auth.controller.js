const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const db = require('../models');


const Usuario = db.Usuario;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 
  message: { success: false, message: 'Demasiadas solicitudes, por favor intente de nuevo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 registros por hora
  message: { success: false, message: 'Demasiados registros desde esta IP.' },
});

function tokenGenerator(user) {
  try {
    const payload = {
      usuario_id: user.usuario_id,
      nombre: user.nombre,
      email: user.email,
      rol_id: user.rol_id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secreto', {
      expiresIn: '1h',
    });

    return token;
  } catch (err) {
    console.error('Error al generar el token:', err);
    throw new Error('Error al generar el token');
  }
}

// ===============================
exports.login = [
  loginLimiter,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await Usuario.findOne({
        where: { email },
        attributes: ['usuario_id', 'nombre', 'email', 'password', 'rol_id', 'telefono']
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      // Generar token JWT
      const token = tokenGenerator(user);

      req.session.userId = user.usuario_id;
      req.session.rol_id = user.rol_id;

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          usuario_id: user.usuario_id,
          nombre: user.nombre,
          email: user.email,
          rol_id: user.rol_id,
        },
      });
    } catch (err) {
      console.error('Error en login:', err);
      next(err);
    }
  }
];

// ===============================
exports.register = [
  registerLimiter,
  async (req, res, next) => {
    try {
      // Validar campos de entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { nombre, email, telefono, password, rol_id } = req.body;

      // Verificar si el email ya está registrado
      const existing = await Usuario.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email ya registrado' });
      }

      // ✅ AÑADIDO: Validar fortaleza de contraseña
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 8 caracteres'
        });
      }

      const saltRounds = parseInt(process.env.BCRYPT_SALT || '12', 10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Crear nuevo usuario
      const newUser = await Usuario.create({
        nombre,
        email,
        telefono,
        password: hashedPassword,
        rol_id: rol_id || 2, // Rol 2 por defecto
      });

      // Generar token tras registro
      const token = tokenGenerator(newUser);

      req.session.userId = newUser.usuario_id;
      req.session.rol_id = newUser.rol_id;

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 1 hora
      });

      return res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          usuario_id: newUser.usuario_id,
          nombre: newUser.nombre,
          email: newUser.email,
          rol_id: newUser.rol_id,
        },
      });
    } catch (err) {
      console.error('Error en registro:', err);
      next(err);
    }
  }
];

//Logout funcional
exports.logout = (req, res, next) => {
  try {
    // Destruir sesión
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
      }

      // Limpiar cookie de sesión correctamente
      res.clearCookie('connect.sid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      // Limpiar cookie del token
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
    });
  } catch (err) {
    console.error('Error en logout:', err);
    next(err);
  }
};