const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tarifa = sequelize.define('Tarifa', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    tipo_vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    precio_hora: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    precio_dia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    precio_semana: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'Tarifas',
    timestamps: false
  });

  return Tarifa;
};