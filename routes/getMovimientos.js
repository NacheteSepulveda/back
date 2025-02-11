// RUTA PARA OBTENER TODAS LOS MOVIMIENTOS DE LA TABLA MYSQL erp2023.bodegas

const express = require('express');
const pool = require('../utils/mysql');

// CONFIGURAR LA CONEXIÓN A LA BASE DE DATOS
const router = express.Router();

router.get('/movimientos', async (req, res) => {
    const {fechaDesde, fechaHasta } = req.query;

    query = `SELECT * FROM erp2023.mov_location 
            WHERE fechamov BETWEEN '${fechaDesde} 00:00:00' AND '${fechaHasta} 23:59:59'
            ORDER BY fechamov DESC`;

    console.log(query);

    pool.query(query, (err, rows) => {
        if(err) throw err;
        res.json(rows);
    });
});

module.exports = router;