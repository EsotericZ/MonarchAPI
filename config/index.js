const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.SQ_NAME,
  process.env.SQ_USER,
  process.env.SQ_PASS,
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      ssl: false,
    },
    timezone: '-07:00',
    logging: (msg) => {
      if (msg.toLowerCase().includes('error')) {
        console.error(msg); // Log only errors
      }
    },
  }
);

module.exports = sequelize;