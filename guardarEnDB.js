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

exports.guardarCasas = async (casas) => {
    for (const casa of casas) {
        try {
            await new Casa(casa).save();
        } catch (error) {
            console.log(`Problema guardando en bd`, error);
        }
    }
};
