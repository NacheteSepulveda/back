const mysql = require('mysql2');

const pool = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'admin',
    waitForConnections: true,
    database:'erp2023'
});

pool.connect((err) => {
    if(err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

module.exports = pool;