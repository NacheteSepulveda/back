// RUTA PARA OBTENER TODOS LOS EMPLEADOS DE LA TABLA MYSQL erp2023.empleados2

const express = require('express');
const pool = require('../utils/mysql');

// CONFIGURAR LA CONEXIÓN A LA BASE DE DATOS
const router = express.Router();

router.get('/empleados-por-id/:id', async (req, res) => { // ASINCRONA PORQUE TRABAJA CON LA BASE DE DATOS
    let id = req.params.id;
    query = `SELECT * FROM erp2023.empleados2 WHERE id = ${id}`;

    pool.query(query, (err, rows) => {
        if(err) throw err;
        res.json(rows);
    });
});

module.exports = router;