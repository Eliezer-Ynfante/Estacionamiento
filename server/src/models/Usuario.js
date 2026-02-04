const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    correo_electronico: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    contraseña: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Almacenado con hash bcrypt o argon2'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'Usuario',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false
  });

  return Usuario;
};