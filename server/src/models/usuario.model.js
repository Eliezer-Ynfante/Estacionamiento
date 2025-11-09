const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    usuario_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    rol_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    hash_contrasena: {
      type: DataTypes.CHAR(60),
      allowNull: false
    },
  }, {
    tableName: 'Usuarios',
    // Mapear createdAt a la columna existente `fecha_registro` y no usar updatedAt
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: false
  });

  return Usuario;
};
