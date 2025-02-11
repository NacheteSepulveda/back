const express = require('express'); // IMPORTAMOS EXPRESS
const app = express(); // INICIALIZAMOS
const port = 3001; // INSTANCIAMOS EL PUERTO
const cors = require('cors'); // CROSS ORIGIN RESOLUTION



// IMPORTACION DE CONFIGRACIONES MIDDLEWARE
app.use(express.json()) // PARA QUE PROCESE JSON
app.use(cors()); // APLICAR CORS


// IMPORTAMOS LAS RUTAS
const getEmpleados = require('./routes/getEmpleados'); // EMPLEADOS
const getBodegas = require('./routes/getBodegas'); // BODEGAS 
const getEmpleadosById = require('./routes/getEmpleadosById'); // BODEGAS 
const postNewEmpleado = require('./routes/postNewEmpleado'); // CREAR EMPLEADO
const putActualizarEmpleado = require('./routes/putActualizarEmpleado');
const postLogin = require('./routes/postLogin'); // LOGIN
const getParts = require('./routes/getParts');// PARTES
const protectedRoute = require('./utils/protectedRoute'); // RUTA PROTEGIDA
const getMovimientos = require('./routes/getMovimientos');// MOVIMIENTOS
const getFactVentas = require('./routes/getFactVenta');// FACTURAS


/////////////////////////////// CRON
//IMPORTAR CRONS
//const ventasxminuto = require('./crons/ventasxmin');
//ventasxminuto();

const registroxsalida = require('./crons/registroxsalida');
registroxsalida();


//USAR RUTAS
app.use(postLogin) // LOGIN
app.use(getEmpleados) // EMPLEADOS  
app.use(getBodegas) // BODEGAS
app.use(getEmpleadosById) // EMPLEADOS POR ID
app.use(postNewEmpleado) // CREAR EMPLEADO
app.use(putActualizarEmpleado) // ACTUALIZAR EMPLEADO
app.use(getParts) // PARTES
app.use(getMovimientos) // MOVIMIENTOS
app.use(getFactVentas) // FACTURAS





let usuarios = {
    '1': {
        'nombre': 'Juan',
        'apellido': 'Perez'
    },
    '2': {
        'nombre': 'Maria',
        'apellido': 'Gomez'
    },

};


// GET usuarios
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

// POST usuario
app.post('/crear-usuario', (req, res) => {

    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let id = Object.keys(usuarios).length + 1;

    usuarios[id] = {
        'nombre': nombre,
        'apellido': apellido
    }

    res.json(usuarios);

});


//DELETE usuario
app.delete('/eliminar-usuario/:id', (req, res) => {
    let id = req.params.id;
    delete usuarios[id]; //ELIMINA EL USUARIO CON EL ID ESPECIFICADO
    res.json(usuarios);
});

// PUT actualizar usuario
app.put('/actualizar-usuario/:id', (req, res) => {

    const id = req.params.id;
    console.log(id);

    // VERIFICAR SI RECIBE EL ID
    if(!id || isNaN(id)){
        res.status(400).json({error: 'Falta el ID del usuario'});
        return
    }

    // VERIFICAR SI ID EXISTE
    if(!usuarios[id]){
        res.status(404).json({error: `Usuario no encontrado con el id ${id}`});
        return
    }

    let nombre = req.body.nombre;
    let apellido = req.body.apellido;

    usuarios[id] = {
        'nombre': nombre,
        'apellido': apellido
    }
    res.json(usuarios);
});


// GET
app.get('/hola', (req, res) => { // SE NECESITAN ESTOS 2 PARAMETROS PARA CORRER LA API 
    res.send('Hola Mundo 2');
});


// INICIAR EL SERVIDOR
app.listen(port, () => {
    console.log(`SERVER CORRIENDO EN EL PUERTO: ${port}`)
});

