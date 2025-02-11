const express = require('express');
const pool = require('../utils/mysql');

// CONFIGURAR LA CONEXIÓN A LA BASE DE DATOS
const router = express.Router();

router.get('/parts/', function (req, res) {

    const query = 'SELECT * FROM erp2023.parts';

    pool.query(query, async (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

module.exports = router;