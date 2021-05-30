const express = require('express');
const mongoose = require('mongoose');
const Casa = require('./casa');

mongoose.connect('mongodb://127.0.0.1:27017/nextviaje', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('error', (error) => {
    console.log('Error conectandose a MongoDB', error);
    //cuando le pasas 1 es que script se ejecuto pero termino en error.
    process.exit(1);
});

const app = express();
const port = 3010;

app.get('/api/casas', async (req, res) => {
    const {
        numeroEstrellas,
        servicios,
        comodidad,
        numeroDeComodidad
    } = req.query;

    const query = {};

    if(numeroEstrellas){
        query.numeroEstrellas = Number(numeroEstrellas);
    }

    if(servicios){
        const s = servicios.split(',');
        query.servicios = { $all:s };
    }

    if(comodidad && numeroDeComodidad){
        query[`comodidades.${comodidad}`] = Number(numeroDeComodidad);
    }

    const resultados = await Casa.find(query);

    res.json(resultados);
});

app.listen(port, () => console.log(`Escuchando en puerto : ${port}`));
