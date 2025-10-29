const express = require('express');
const mysql = require('mysql2/promise');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.disable('x-powered-by')
app.use(express.json());

let connection;
(async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    console.log('Conexión establecida con MySQL');

    const [rows, fields] = await connection.execute('SELECT * FROM users');
    console.table(rows);
    console.table(fields);
  } catch (err) {
    console.error('Error de conexion', err.message);
    process.exit(1);
  }
}) ();