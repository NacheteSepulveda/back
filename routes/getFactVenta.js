const express = require('express');
const pool = require('../utils/softlandSql');

const router = express.Router();

router.get('/factventas', async (req, res) => {
    try {
        const { rutCli, nFactura, nv } = req.query;

        const poolConnection = await pool.connect();
        let query = `
            SELECT 
                [N_FACTURA] AS FOLIO,
                [NV],
                [FECHA_FAC],
                [NOM_CLI],
                [RUT_CLI],
                [CODIGO],
                [COD_DESCRIP] AS descripcion,
                [CANTIDAD],
                [PRECIO],
                [TOTAL]
            FROM [ITA].[dbo].[CONSULTA_FACT_VENTA]
            WHERE FECHA_FAC BETWEEN '2020-01-01' AND GETDATE()`;

                // 🔹 Aplica filtro según el parámetro recibido
        if (nFactura) {
            query += ` AND N_FACTURA = ${nFactura}`;

        } else if (nv) {
             query += ` AND NV = ${nv}`;

        } else if (rutCli) {
            query += ` AND RUT_CLI = '${rutCli}'`; // Se agregan comillas porque RUT es texto
        }
            
        query += " ORDER BY FECHA_FAC DESC";


        console.log("Ejecutando consulta:", query);

        // 🔹 Preparar la consulta con parámetros seguros
        const request = poolConnection.request();
        if (nFactura) request.input('nFactura', nFactura);
        if (nv) request.input('nv', nv);
        if (rutCli) request.input('rutCli', rutCli);

        // ✅ Ejecutar la consulta correctamente
        const result = await poolConnection.request().query(query);
        poolConnection.close();

        if (!result || !result.recordset || result.recordset.length === 0) {
            return res.status(404).json({ error: "No se encontraron datos" });
        }

         // Agrupar los productos en el detalle
         const factura = {
            folio: result.recordset[0].FOLIO,
            Nv: result.recordset[0].NV,
            Fecha: result.recordset[0].FECHA_FAC,
            Cliente: result.recordset[0].NOM_CLI,
            RutCliente: result.recordset[0].RUT_CLI,
            TotalFactura: result.recordset.reduce((acc, row) => acc + row.TOTAL, 0),
            detalle: result.recordset.map(row => ({
                codigo: row.CODIGO,
                descripcion: row.descripcion,
                cantidad: row.CANTIDAD,
                precio: row.PRECIO,
                total: row.TOTAL
            }))
        };

        res.json(factura);

    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
