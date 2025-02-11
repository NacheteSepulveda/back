const cron = require('node-cron');
const pool = require('../utils/softlandSql');  // Conexión SQL Server
const mysqlPool = require('../utils/mysql'); // Conexión MySQL con Callbacks

console.log('📌 Cron JOB ACTIVADO...');

// CRON REGISTRA GUIAS DE SALIDA CADA 10 MINUTOS
const ventasxmin = () => {
    cron.schedule('*/10 * * * *', () => {
        console.log('📌 Registrando guías de salida cada 10 minutos...');

        pool.connect(async (err, connection) => {
            if (err) {
                console.error('❌ Error al conectar a SQL Server:', err);
                return;
            }

            const query = `
                SELECT Folio, Fecha
                FROM [ITA].[softland].[iw_gsaen]
                WHERE TIPO = 'S' AND CONCEPTO = 10
                ORDER BY Fecha DESC
            `;

            connection.request().query(query, (err, result) => {
                if (err) {
                    console.error('❌ Error en la consulta SQL Server:', err);
                    return;
                }

                console.log('✅ Consulta enviada:', query);

                const registros = result.recordset;
                if (registros.length === 0) {
                    console.log('✅ No hay nuevos registros para insertar.');
                    return;
                }

                const fechaHoy = new Date().toISOString().split('T')[0];

                // 🔹 Insertar registros en MySQL evitando duplicados
                registros.forEach(row => {
                    mysqlPool.query(
                        `SELECT folio FROM registro_salida WHERE folio = ?`,
                        [row.Folio],
                        (err, exists) => {
                            if (err) {
                                console.error('❌ Error al verificar existencia del folio en MySQL:', err);
                                return;
                            }

                            if (exists.length > 0) {
                                console.log(`⚠️ Folio ${row.Folio} ya existe, no insertado.`);
                                return;
                            }

                            mysqlPool.query(
                                `INSERT INTO registro_salida (folio, fecha_creacion, integrado, fecha_integra) 
                                 VALUES (?, ?, 1, ?)`,
                                [row.Folio, row.Fecha, fechaHoy],
                                (err, result) => {
                                    if (err) {
                                        console.error('❌ Error al insertar en MySQL:', err);
                                        return;
                                    }

                                    if (result.affectedRows > 0) {
                                        console.log(`✔️ Registro insertado: Folio ${row.Folio}, Fecha Integración: ${fechaHoy}`);
                                    }
                                }
                            );
                        }
                    );
                });
            });
        });
    });
};

module.exports = ventasxmin;
