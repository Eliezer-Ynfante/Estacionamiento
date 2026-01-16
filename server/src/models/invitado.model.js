const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Invitado = sequelize.define('Invitado', {
    invitado_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      unique: true
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    placa_vehiculo: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    tipo_vehiculo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    marca_vehiculo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    color_vehiculo: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    tableName: 'Invitados',
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: false
  });

  return Invitado;
};