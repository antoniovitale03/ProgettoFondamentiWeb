const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI
async function connectDB() {
    mongoose.connect(mongoURI)
        .then(() => console.log('MongoDB connesso con successo!'))
        .catch(err => console.error('Errore di connessione a MongoDB:', err));

}

module.exports = connectDB;