const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Plaza = sequelize.define('Plaza', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    tipo_vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'Plazas',
    timestamps: false
  });

  return Plaza;
};