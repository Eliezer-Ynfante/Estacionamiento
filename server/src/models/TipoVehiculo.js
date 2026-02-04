const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TipoVehiculo = sequelize.define('TipoVehiculo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'Tipo_Vehiculo',
    timestamps: false
  });

  return TipoVehiculo;
};