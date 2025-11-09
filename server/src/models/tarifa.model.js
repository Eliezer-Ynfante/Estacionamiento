const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tarifa = sequelize.define('Tarifa', {
    tarifa_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    precio_hora: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    precio_dia: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    precio_semana: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    }
  }, {
    tableName: 'Tarifas',
    timestamps: false
  });

  return Tarifa;
};
