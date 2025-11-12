const app = require('./src/app');
const { sequelize, testConnection } = require('./src/config/sequelize');

testConnection();

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
  console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Cookies httpOnly: HABILITADAS`);
});
