const mongoose = require('mongoose');

//inserisco soltanto le informazioni dei film da mostrare quando l'utente visita la pagina relativa alla watchlist
const filmSchema = new mongoose.Schema({
    _id: { type: Number, required: true }, // id di tmdb
    title: { type: String, required: true },
    release_date: { type: Number, required: true },
    director: {type: String, required: true},
    poster_path: {type: String, required: true},
})

module.exports = mongoose.model("Film", filmSchema);