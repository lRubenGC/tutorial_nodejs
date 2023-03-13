const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('BD Online');

    } catch (err) {
        console.log(err);
        throw new Error('Error en la conexión a la DB');
    }
}

module.exports = {
    dbConnection
};