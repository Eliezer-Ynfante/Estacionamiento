const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Vehiculo = sequelize.define('Vehiculo', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      tipo_vehiculo_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      placa: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      marca: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      color: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      año: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
      tableName: 'Vehiculo',
      timestamps: false
    });
  
    return Vehiculo;
  };