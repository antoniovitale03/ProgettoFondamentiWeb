const mongoose = require("mongoose");
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSW}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
async function connectDB() {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('MongoDB connesso con successo!'))
        .catch(err => console.error('Errore di connessione a MongoDB:', err));
}

module.exports = connectDB;