const mongoose = require('mongoose');

//inserisco soltanto le informazioni dei film da mostrare quando l'utente visita la pagina relativa alla watchlist
const filmSchema = new mongoose.Schema({
    user_id: {type: String, required: true}, // -> id dell'utente che corrisponde all' _id del documento utente in MongoDB
    film_id: { type: String, required: true }, // -> id del film dell'api TMDB
    title: { type: String, required: true },
    release_year: { type: Number, required: true },
    director: {
        id: {type: Number, required: true},
        name: { type: String, required: true }
    },
    date: { type: String }, //usato per indica la data di visione nella lista dei film visti
    poster_path: {type: String, required: true},
    isInWatchlist: { type: Boolean, default: false },
    isLiked: { type: Boolean, default: false},
    isReviewed: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false},
    isWatched: { type: Boolean, default: false }
})

module.exports = mongoose.model("Film", filmSchema);