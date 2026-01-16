const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  const ServiceAditional = sequelize.define('ServiceAditional', {
    servicio_id: { 
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    precio: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.00
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    }, {
    tableName: 'Servicios',
    timestamps: false
    });

    return ServiceAditional;
};