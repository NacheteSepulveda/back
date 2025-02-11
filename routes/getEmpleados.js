// RUTA PARA OBTENER TODOS LOS EMPLEADOS DE LA TABLA MYSQL erp2023.empleados2

const express = require('express');
const pool = require('../utils/mysql');

// CONFIGURAR LA CONEXIÓN A LA BASE DE DATOS
const router = express.Router();

router.get('/empleados', async (req, res) => {
    query = 'SELECT * FROM erp2023.empleados2';

    pool.query(query, (err, rows) => {
        if(err) throw err;
        res.json(rows);
    });
});

module.exports = router;