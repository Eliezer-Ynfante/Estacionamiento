const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vehiculo = sequelize.define('Vehiculo', {
    vehiculo_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    placa: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true
    },
    marca: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    tableName: 'Vehiculos',
    timestamps: false
  });

  return Vehiculo;
};
