const mongoose = require('mongoose');

//inserisco soltanto le informazioni dei film da mostrare quando l'utente visita la pagina relativa alla watchlist
const filmSchema = new mongoose.Schema({
    _id: { type: Number, required: true }, // id di tmdb
    title: { type: String, required: true },
    release_year: { type: Number, required: true },
    director: {
        id: {type: Number, required: true},
        name: { type: String, required: true }
    },
    poster_path: {type: String, required: true},
})

module.exports = mongoose.model("Film", filmSchema);