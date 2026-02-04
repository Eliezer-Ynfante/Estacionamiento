const app = require('./src/app');
const { testConnection } = require('./src/config/sequelize');
require("dotenv").config();

testConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV}`);
  }
});
