const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pago = sequelize.define('Pago', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    reserva_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    metodo_pago: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'pagado', 'reembolso'),
      defaultValue: 'pendiente'
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Pago',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false
  });

  return Pago;
};