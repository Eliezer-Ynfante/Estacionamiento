const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pago = sequelize.define('Pago', {
    pago_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    reserva_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    monto: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    metodo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    estado_pago: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    // fecha_pago la manejaremos como createdAt mediante timestamps
  }, {
    tableName: 'Pagos',
    timestamps: true,
    createdAt: 'fecha_pago',
    updatedAt: false
  });

  return Pago;
};
