const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userID: { type: String, ref: 'User', required: true },
    filmID: { type: Number, required: true }, //id di TMDB quindi può essere anche numero
    filmTitle: { type: String, required: true },
    actionType: { type: String, required: true }, // tipo di azione (es. ADD_TO_WATCHLIST, ADD_REVIEW, ecc.)
    rating: { type: Number }, //usato nel caso venga aggiunta una recensione
    date: { type: Date, default: Date.now },
})