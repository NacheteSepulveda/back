const cron = require('node-cron');
const pool = require('../utils/softlandSql');  // Conexión SQL Server
const mysqlPool = require('../utils/mysql'); // Conexión MySQL

console.log('📌 Cron JOB ACTIVADO...');

// 🔹 Verificación de la conexión a MySQL
if (!mysqlPool || typeof mysqlPool.query !== 'function') {
    throw new Error('❌ mysqlPool no está definido correctamente');
}

// CRON REGISTRA GUIAS DE SALIDA CADA 10 MINUTOS
const ventasxmin = () => {
    cron.schedule('*/10 * * * *', async () => {
        console.log('📌 Registrando guías de salida cada 10 minutos...');

        try {
            // 🔹 Conectar a SQL Server
            const connection = await pool.connect();
            const query = `
                SELECT Folio, Fecha
                FROM [ITA].[softland].[iw_gsaen]
                WHERE TIPO = 'S' AND CONCEPTO = 10
                ORDER BY Fecha DESC
            `;
            const result = await connection.request().query(query);
            console.log('✅ Consulta enviada:', query);

            const registros = result.recordset;
            if (registros.length === 0) {
                console.log('✅ No hay nuevos registros para insertar.');
                return;
            }

            // 🔹 Obtener la fecha de integración (hoy)
            const fechaHoy = new Date().toISOString().split('T')[0];

            // 🔹 Insertar registros en MySQL evitando duplicados
            for (const row of registros) {
                try {
                    // 🔹 Verificar si el folio ya existe en MySQL antes de insertar
                    const [exists] = await mysqlPool.query(
                        `SELECT folio FROM registro_salida WHERE folio = ?`,
                        [row.Folio]
                    );

                    if (exists.length > 0) {
                        console.log(`⚠️ Folio ${row.Folio} ya existe, no insertado.`);
                        continue; // ⬅️ Salta al siguiente registro si ya está en MySQL
                    }

                    // 🔹 Insertar el registro si no existe en MySQL
                    const [result] = await mysqlPool.query(
                        `INSERT INTO registro_salida (folio, fecha_creacion, integrado, fecha_integra) 
                         VALUES (?, ?, 1, ?)`,

                        [row.Folio, row.Fecha, fechaHoy]
                    );

                    if (result.affectedRows > 0) {
                        console.log(`✔️ Registro insertado: Folio ${row.Folio}, Fecha Integración: ${fechaHoy}`);
                    }

                } catch (insertError) {
                    console.error('❌ Error al insertar en MySQL:', insertError);
                }
            }

        } catch (error) {
            console.error('❌ Error en la ejecución del cron:', error);
        }
    });
};

module.exports = ventasxmin;
