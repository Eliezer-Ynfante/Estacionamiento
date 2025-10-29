const express = require('express');
const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Servidor Express funcionando correctamente!');
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
