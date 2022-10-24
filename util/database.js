const mysql = require('mysql2');
require('dotenv').config({ path: './.env.local' });

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete2',
  password: process.env.MYSQLPW,
});

module.exports = pool.promise();
