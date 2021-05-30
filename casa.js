const mongoose = require('mongoose');

const CasaSchema = new mongoose.Schema({
    imgs: [{ type: String }],
    titulo: String,
    ubicacion: String,
    precio: Number,
    comodidades: {
        habitaciones: Number,
        camas: Number,
        baños: Number,
    },
    servicios: [{ type: String }],
    numeroEstrellas: Number,
    numeroOpiniones: Number,
    opiniones: [
        {
            nombrePersona: String,
            fecha: String,
            comentario: String,
        },
    ],
    url: String,
});

module.exports =  mongoose.model('casa', CasaSchema);