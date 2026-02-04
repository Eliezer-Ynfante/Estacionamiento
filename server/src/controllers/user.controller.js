const bcrypt = require('bcrypt');
const { z } = require('zod');
const { Usuario } = require('../models');
const { actualizarUsuarioSchema } = require('../schemas/usuarioSchema');

// =====================================================
// OBTENER PERFIL DEL USUARIO AUTENTICADO
// =====================================================
exports.obtenerPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.user.id, {
            attributes: { exclude: ['contraseña'] }
        });

        if (!usuario) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }

        return res.status(200).json({
            success: true,
            data: usuario
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Error interno' });
    }
};

// =====================================================
// ACTUALIZAR PERFIL DEL USUARIO
// =====================================================
exports.actualizarPerfil = async (req, res) => {
    try {
        const datosValidados = actualizarUsuarioSchema.parse(req.body);
        const usuario = await Usuario.findByPk(req.user.id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        if (datosValidados.correo_electronico && datosValidados.correo_electronico !== usuario.correo_electronico) {
            const emailExistente = await Usuario.findOne({
                where: { correo_electronico: datosValidados.correo_electronico.toLowerCase() }
            });

            if (emailExistente) {
                return res.status(409).json({
                    success: false,
                    error: 'El correo electrónico ya está registrado'
                });
            }
        }

        await usuario.update(datosValidados);

        return res.status(200).json({
            success: true,
            mensaje: 'Perfil actualizado exitosamente',
            data: {
                nombre: usuario.nombre,
                correo_electronico: usuario.correo_electronico,
                activo: usuario.activo,
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
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// =====================================================
// CAMBIAR CONTRASEÑA
// =====================================================
exports.cambiarContraseña = async (req, res) => {
    try {
        const { contraseña_actual, contraseña_nueva } = req.body;

        if (!contraseña_actual || !contraseña_nueva) {
            return res.status(400).json({
                success: false,
                error: 'La contraseña actual y nueva son requeridas'
            });
        }

        const schemaContraseña = z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/);
        const validacion = schemaContraseña.safeParse(contraseña_nueva);

        if (!validacion.success) {
            return res.status(400).json({
                success: false,
                error: 'La nueva contraseña no cumple con los requisitos de seguridad'
            });
        }

        const usuario = await Usuario.findByPk(req.user.id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        const contraseña_correcta = await bcrypt.compare(contraseña_actual, usuario.contraseña);

        if (!contraseña_correcta) {
            return res.status(401).json({
                success: false,
                error: 'La contraseña actual es incorrecta'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const contraseña_nueva_hasheada = await bcrypt.hash(contraseña_nueva, salt);

        await usuario.update({ contraseña: contraseña_nueva_hasheada });

        return res.status(200).json({
            success: true,
            mensaje: 'Contraseña actualizada exitosamente'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};
