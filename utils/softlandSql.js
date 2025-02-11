const sql = require('mssql');

const config = {
  user: 'Nacho',
  password: 'ITA123Nacho',
  server: '72.167.43.234',
  database: 'ITA',
  options: {
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config);

module.exports = pool;