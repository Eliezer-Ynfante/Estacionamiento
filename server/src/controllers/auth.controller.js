const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { Usuario } = require('../models'); 
const { crearUsuarioSchema } = require('../schemas/usuarioSchema.js');

// ==============================================
// REGISTRO DE USUARIO
// ==============================================

exports.registro = async (req, res) => {
    try {
        const datosValidados = crearUsuarioSchema.parse(req.body);

        const correoNormalizado = datosValidados.correo_electronico.toLowerCase();

        const usuarioExistente = await Usuario.findOne({
            where: { correo_electronico: correoNormalizado }
        });

        if (usuarioExistente) {
            return res.status(409).json({
                success: false,
                error: 'El correo electrónico ya está registrado'
            });
        }

        const saltRounds = 10;
        const contraseña_hasheada = await bcrypt.hash(datosValidados.contraseña, saltRounds);

        const nuevoUsuario = await Usuario.create({
            nombre: datosValidados.nombre,
            correo_electronico: correoNormalizado, 
            contraseña: contraseña_hasheada,
            activo: true
        });

        const token = jwt.sign(
            {
                id: nuevoUsuario.id,
                correo_electronico: nuevoUsuario.correo_electronico,
                nombre: nuevoUsuario.nombre
            },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        // Configurar Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24
        });

        return res.status(201).json({
            success: true,
            mensaje: 'Usuario registrado exitosamente',
            data: {
                email: nuevoUsuario.correo_electronico,
                nombre: nuevoUsuario.nombre,
                activo: nuevoUsuario.activo,
            },
            token
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

        if (error.name === 'SequelizeUniqueConstraintError') {
            const firstError = error.errors && error.errors[0];
            const field = firstError
                ? (Array.isArray(firstError.path) ? firstError.path.join('.') : firstError.path)
                : 'campo';
            return res.status(409).json({
                success: false,
                error: `El ${field} ya está registrado`
            });
        }

        console.error('Error en registro:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}

// =====================================================
// LOGIN DE USUARIO
// =====================================================

exports.login = async (req, res) => {
    try {
        const { correo_electronico, contraseña } = req.body;

        if (!correo_electronico || !contraseña) {
            return res.status(400).json({
                success: false,
                error: 'El correo y contraseña son requeridos'
            });
        }

        const usuario = await Usuario.findOne({
            where: {
                correo_electronico: correo_electronico.toLowerCase()
            }
        });

        if (!usuario) {
            return res.status(401).json({
                success: false,
                error: 'Correo o contraseña incorrectos'
            });
        }

        if (!usuario.activo) {
            return res.status(403).json({
                success: false,
                error: 'Tu cuenta ha sido desactivada'
            });
        }

        const contraseña_valida = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!contraseña_valida) {
            return res.status(401).json({
                success: false,
                error: 'Correo o contraseña incorrectos'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                correo_electronico: usuario.correo_electronico,
                nombre: usuario.nombre
            },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24
        });

        return res.status(200).json({
            success: true,
            mensaje: 'Login exitoso',
            data: {
                nombre: usuario.nombre,
                correo_electronico: usuario.correo_electronico,
                activo: usuario.activo
            },
            token
        });

    } catch (error) {
        console.error('Error en login: ', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// =====================================================
// LOGOUT DE USUARIO
// =====================================================

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({
            success: true,
            mensaje: 'Has cerrado sesión exitosamente'
        });

    } catch (error) {
        console.error('Error en logout:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor al cerrar sesión'
        });
    }
};