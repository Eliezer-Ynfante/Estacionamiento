const { sequelize } = require('../config/sequelize');
const path = require('path');

// Importar modelos
const TipoVehiculo = require('./TipoVehiculo')(sequelize);
const Usuario = require('./Usuario')(sequelize);
const Vehiculo = require('./Vehiculo')(sequelize);
const Tarifa = require('./Tarifa')(sequelize);
const Plaza = require('./Plaza')(sequelize);
const Servicio = require('./Servicio')(sequelize);
const Reserva = require('./Reserva')(sequelize);
const Pago = require('./Pago')(sequelize);
const HistorialPlaza = require('./HistorialPlaza')(sequelize);

// =====================================================
// DEFINIR RELACIONES
// =====================================================

// TipoVehiculo
TipoVehiculo.hasMany(Vehiculo, { foreignKey: 'tipo_vehiculo_id', as: 'vehiculos' });
TipoVehiculo.hasMany(Tarifa, { foreignKey: 'tipo_vehiculo_id', as: 'tarifas' });
TipoVehiculo.hasMany(Plaza, { foreignKey: 'tipo_vehiculo_id', as: 'plazas' });

// Usuario
Usuario.hasMany(Vehiculo, { foreignKey: 'usuario_id', as: 'vehiculos', onDelete: 'CASCADE' });
Usuario.hasMany(Reserva, { foreignKey: 'usuario_id', as: 'reservas', onDelete: 'CASCADE' });

// Vehiculo
Vehiculo.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Vehiculo.belongsTo(TipoVehiculo, { foreignKey: 'tipo_vehiculo_id', as: 'tipo' });
Vehiculo.hasMany(Reserva, { foreignKey: 'vehiculo_id', as: 'reservas' });

// Tarifa
Tarifa.belongsTo(TipoVehiculo, { foreignKey: 'tipo_vehiculo_id', as: 'tipo' });

// Plaza
Plaza.belongsTo(TipoVehiculo, { foreignKey: 'tipo_vehiculo_id', as: 'tipo' });
Plaza.hasMany(Reserva, { foreignKey: 'plaza_id', as: 'reservas' });
Plaza.hasMany(HistorialPlaza, { foreignKey: 'plaza_id', as: 'historial', onDelete: 'CASCADE' });

// Servicio
Servicio.hasMany(Reserva, { foreignKey: 'servicio_id', as: 'reservas' });

// Reserva
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Reserva.belongsTo(Plaza, { foreignKey: 'plaza_id', as: 'plaza' });
Reserva.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });
Reserva.belongsTo(Servicio, { foreignKey: 'servicio_id', as: 'servicio' });
Reserva.hasOne(Pago, { foreignKey: 'reserva_id', as: 'pago', onDelete: 'CASCADE' });
Reserva.hasMany(HistorialPlaza, { foreignKey: 'reserva_id', as: 'historialPlaza' });

// Pago
Pago.belongsTo(Reserva, { foreignKey: 'reserva_id', as: 'reserva', onDelete: 'CASCADE' });

// HistorialPlaza
HistorialPlaza.belongsTo(Plaza, { foreignKey: 'plaza_id', as: 'plaza', onDelete: 'CASCADE' });

// Sincronizar modelos
sequelize.sync({ alter: false }).then(() => {
  console.log('Base de datos sincronizada');
}).catch(err => {
  console.error('Error al sincronizar BD:', err);
});

module.exports = {
  sequelize,
  TipoVehiculo,
  Usuario,
  Vehiculo,
  Tarifa,
  Plaza,
  Servicio,
  Reserva,
  Pago,
  HistorialPlaza
};