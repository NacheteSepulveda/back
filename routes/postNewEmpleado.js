const express = require('express');
const pool = require('../utils/mysql');

// CONFIGURAR LA CONEXIÓN A LA BASE DE DATOS
const router = express.Router();

router.post('/nuevo-empleado/', async (req, res) => {
    const { rut, 
            login, 
            password, 
            nombre, 
            apellido_p, 
            apellido_m, 
            telefono, 
            mail, 
            supervisor, 
            perfil,
            cod_vendedor, 
            odoo_partner_id } = req.body;

            console.log("Paramentros recibidos: ", req.body);

            query = `INSERT INTO erp2023.empleados2 (rut, login, password, nombre, apellido_p, apellido_m, telefono, mail, supervisor, perfil, cod_vendedor, odoo_partner_id) VALUES ('${rut}', '${login}', '${password}', '${nombre}', '${apellido_p}', '${apellido_m}', '${telefono}', '${mail}', '${supervisor}', '${perfil}', '${cod_vendedor}', '${odoo_partner_id
            }')`;

    pool.query(query, (err, rows) => {
        if(err) throw err;
        res.json({'mensaje': 'Empleado agregado con éxito!'});
    });
});

module.exports = router;