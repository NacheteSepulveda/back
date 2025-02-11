const express = require('express');
const pool = require('../utils/mysql');

// CONFIGURAR LA CONEXIÓN A LA BASE DE DATOS
const router = express.Router();

router.put('/actualizar-empleado/:id', function (req, res) {


    const id = req.params.id;
    const {rut, login, password, nombre, apellido_p, apellido_m, telefono, mail, supervisor, perfil, activo,  cod_vendedor, odoo_partner_id} = req.body;
    console.log('PARAMENTROS RECIBIDOS: ', req.body);
    console.log('ID RECIBIDO: ', req.params.id);

    // Validar que el ID sea válido
    if (!id || isNaN(Number(id))) {
        return res.status(400).send("El ID del empleado es inválido");
    }


    // Verificar si el ID del empleado existe en la base de datos
    const checkQuery = "SELECT COUNT(*) AS count FROM erp2023.empleados2 WHERE id = ?";
    
    pool.query(checkQuery, [id], (err, result) => {
        if (err) {
            console.error("Error al verificar el ID del empleado:", err);
            return res.status(500).send("Error al verificar el ID del empleado");
        }

        if (result[0].count === 0) {
            return res.status(404).send("El ID del empleado no existe");
        }

        // Si el ID existe, proceder con la actualización
        const updateQuery = `
        UPDATE erp2023.empleados2 
        SET rut = ?, login = ?, password = ?, nombre = ?, apellido_p = ?, apellido_m = ?, 
            telefono = ?, mail = ?, supervisor = ?, perfil = ?, cod_vendedor = ?, odoo_partner_id = ? 
        WHERE id = ?
        `;

        const values = [rut, login, password, nombre, apellido_p, apellido_m, telefono, mail, supervisor, perfil, cod_vendedor, odoo_partner_id, id];

        pool.query(updateQuery, values, (err, result) => {
            if (err) {
                console.error("Error al actualizar el empleado:", err);
                return res.status(500).send("Error al actualizar los datos");
            }

            return res.json({ mensaje: "Empleado actualizado con éxito!" });
        });
    });
});

module.exports = router;