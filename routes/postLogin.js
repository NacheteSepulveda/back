const express = require("express");
const pool = require("../utils/mysql");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "1234";
const router = express.Router();

router.post("/login/", (req, res) => {
    const { login, password } = req.body;
    console.log("Credenciales Recibidas:", req.body);

    if (!login || !password) {
        return res.status(400).json({ error: "Debes proporcionar un login y password" });
    }

    // Consulta segura con parámetros
    const query = `SELECT * FROM erp2023.empleados2 WHERE login = ? AND password = ?`;

    pool.query(query, [login, password], (err, rows) => {
        if (err) {
            console.error("Error al intentar iniciar sesión:", err);
            return res.status(500).json({ error: "Error al intentar iniciar sesión" });
        }

        if (rows.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const empleado = rows[0];

        // Generar JWT con más información
        const token = jwt.sign(
            {
                id: empleado.id,
                nombre: empleado.nombre,
                rol: empleado.rol,
            },
            SECRET_KEY,
            { expiresIn: "24h" }
        );

        console.log("Token generado:", token);

        return res.json({
            token: token,
            mensaje: "Acceso Permitido",
            usuario: { id: empleado.id, nombre: empleado.nombre, rol: empleado.rol }
        });
    });
});

module.exports = router;