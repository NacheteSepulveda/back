const express = require("express");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "1234";

const protectedRoute = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ error: "FALTA TOKEN / No está autorizado" });
    }

    // Verificar si el token viene en formato "Bearer <token>"
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(400).json({ error: "Formato de token inválido. Usa 'Bearer <token>'" });
    }

    const token = tokenParts[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(403).json({ error: "Token expirado" });
            }
            return res.status(403).json({ error: "Token inválido" });
        }

        req.user = decoded; // Guardar los datos del usuario en la petición
        next(); // Pasar al siguiente middleware
    });
};

module.exports = protectedRoute;
