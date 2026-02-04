const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HistorialPlaza = sequelize.define('HistorialPlaza', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    plaza_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reserva_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'Historial_Plaza',
    timestamps: false
  });

  return HistorialPlaza;
};