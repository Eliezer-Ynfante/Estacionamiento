const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Servidor Express funcionando correctamente!');
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
