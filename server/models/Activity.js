const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: {type: String, ref: "User", required: true},
    filmID: { type: Number, required: true }, //id di TMDB quindi può essere anche numero
    filmTitle: { type: String, required: true },
    action: { type: String, enum: ['ADD_TO_WATCHLIST', 'ADD_TO_FAVORITES', 'ADD_TO_WATCHED', 'ADD_REVIEW'], required: true }, // tipo di azione
    rating: { type: Number }, //usato nel caso venga aggiunta una recensione
    date: { type: Date, required: true },
})

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;