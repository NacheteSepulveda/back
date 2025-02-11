const cron = require('node-cron');
const pool = require('../utils/softlandSql');

// CRON CONSULTA LA VISTA FACT VENTAS CADA 5 MINUTOS
const ventasxmin = () => {

    cron.schedule('*/5 * * * * *', async () => {
        console.log('Consultando cron de ventas cada 5 minutos...');
        try{
            const connection = await pool.connect();
            const query = 'SELECT * FROM [ITA].[dbo].[CONSULTA_FACT_VENTA]';
            const result = await connection.request().query(query);
            console.log('Resultados:', result.recordset);

        } catch (error) {
            console.error('Error:', error);
        }
    });
};

module.exports = ventasxmin;