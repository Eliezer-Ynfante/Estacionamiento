const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reserva = sequelize.define('Reserva', {
    reserva_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    plaza_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    vehiculo_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    fecha_hora_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    fecha_hora_fin: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    estado: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    costo_total: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
  }, {
    tableName: 'Reservas',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false
  });

  return Reserva;
};
