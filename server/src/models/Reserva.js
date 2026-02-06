const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reserva = sequelize.define('Reserva', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    plaza_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    servicio_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_hora_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_hora_fin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    monto_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('pendiente_pago', 'confirmada', 'activa', 'completada', 'cancelada'),
      defaultValue: 'pendiente_pago'
    }
  }, {
    tableName: 'Reserva',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false
  });

  return Reserva;
};