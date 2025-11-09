const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/sequelize');

const basename = path.basename(__filename);
const db = {};

// Importar modelos
const roleModel = require('./role.model');
const tarifaModel = require('./tarifa.model');
const usuarioModel = require('./usuario.model');
const vehiculoModel = require('./vehiculo.model');
const plazaModel = require('./plaza.model');
const reservaModel = require('./reserva.model');
const pagoModel = require('./pago.model');

db.Role = roleModel(sequelize);
db.Tarifa = tarifaModel(sequelize);
db.Usuario = usuarioModel(sequelize);
db.Vehiculo = vehiculoModel(sequelize);
db.Plaza = plazaModel(sequelize);
db.Reserva = reservaModel(sequelize);
db.Pago = pagoModel(sequelize);

// Asociaciones
db.Role.hasMany(db.Usuario, { foreignKey: 'rol_id' });
db.Usuario.belongsTo(db.Role, { foreignKey: 'rol_id' });

db.Tarifa.hasMany(db.Plaza, { foreignKey: 'tarifa_id' });
db.Plaza.belongsTo(db.Tarifa, { foreignKey: 'tarifa_id' });

db.Usuario.hasMany(db.Vehiculo, { foreignKey: 'usuario_id' });
db.Vehiculo.belongsTo(db.Usuario, { foreignKey: 'usuario_id' });

db.Usuario.hasMany(db.Reserva, { foreignKey: 'usuario_id' });
db.Reserva.belongsTo(db.Usuario, { foreignKey: 'usuario_id' });

db.Vehiculo.hasMany(db.Reserva, { foreignKey: 'vehiculo_id' });
db.Reserva.belongsTo(db.Vehiculo, { foreignKey: 'vehiculo_id' });

db.Plaza.hasMany(db.Reserva, { foreignKey: 'plaza_id' });
db.Reserva.belongsTo(db.Plaza, { foreignKey: 'plaza_id' });

db.Reserva.hasMany(db.Pago, { foreignKey: 'reserva_id' });
db.Pago.belongsTo(db.Reserva, { foreignKey: 'reserva_id' });

db.sequelize = sequelize;

module.exports = db;
