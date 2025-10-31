const app = require('./src/app');
const { testConnection } = require('./src/config/conexion');

testConnection();

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
