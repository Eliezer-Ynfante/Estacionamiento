const db = require('../models');
const Usuario = db.Usuario;

exports.actualizarUsuario = async (req, res) => {
    const id = req.params.id;
    const { nombre, email, telefono } = req.body;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        usuario.nombre = nombre || usuario.nombre;
        usuario.email = email || usuario.email;
        usuario.telefono = telefono || usuario.telefono;
        await usuario.save();
        res.status(200).json({ mensaje: 'Usuario actualizado exitosamente', usuario });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el usuario', error: error.message });
    }
};

exports.eliminarUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        await usuario.destroy();
        res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: error.message });
    }
}