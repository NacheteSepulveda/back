// RUTA PARA OBTENER TODAS LAS BODEGAS DE LA TABLA MYSQL erp2023.bodegas

const express = require('express');
const pool = require('../utils/mysql');

// CONFIGURAR LA CONEXIÓN A LA BASE DE DATOS
const router = express.Router();

router.get('/bodegas', async (req, res) => {
    query = 'SELECT * FROM erp2023.bodegas';

    pool.query(query, (err, rows) => {
        if(err) throw err;
        res.json(rows);
    });
});

module.exports = router;