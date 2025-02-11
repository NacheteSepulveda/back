const express = require('express');
const pool = require('../utils/softlandSql');

// CONFIGURAR LA CONEXIÓN A LA BASE DE DATOS
const router = express.Router();

router.get('/buscardocs', async (req, res) => {
    poolConnection = await pool.connect();
        const query = 'SELECT * FROM docs';
    });