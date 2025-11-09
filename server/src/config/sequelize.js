const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { Sequelize } = require('sequelize');

// Construir la conexión usando variables de entorno
const DB_NAME = process.env.DB_NAME || 'estacionamiento';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: process.env.SEQUELIZE_LOG === 'true' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true
  }
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    // No hacemos sync automático aquí; es decisión del despliegue/migrations
    console.log('Sequelize: conexión establecida con la base de datos');
    return true;
  } catch (err) {
    console.error('Sequelize: error de conexión ->', err.message || err);
    return false;
  }
}

module.exports = {
  sequelize,
  Sequelize,
  testConnection
};

/*
  Uso: const { sequelize, testConnection } = require('./config/sequelize');
  Luego puedes definir modelos en `server/src/models` y asociarlos con `sequelize.define(...)` o usando clases.
  Para migraciones considera instalar `sequelize-cli` y usar `npx sequelize-cli`.
*/
