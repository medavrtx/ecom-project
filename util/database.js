const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './.env.local' });

const sequelize = new Sequelize('node-complete', 'root', process.env.MYSQLPW, {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
