const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Plaza = sequelize.define('Plaza', {
    plaza_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    tarifa_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    numero_plaza: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    tipo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    esta_activa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'Plazas',
    timestamps: false
  });

  return Plaza;
};
