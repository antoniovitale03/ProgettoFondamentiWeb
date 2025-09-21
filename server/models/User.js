const mongoose = require('mongoose');
//utilizziamo l'associazione tramite riferimento e non tramite embedding per rendere lo sviluppo futuro della web app più scalabile
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    surname: { type: String },
    biography: { type: String },
    country: { type: String },
    refreshToken: { type: String },
    watchlist: [{ type: Number, ref: "Film" }],
    liked: [{ type: Number, ref: "Film" }],
    favorites: [{ type: Number, ref: "Film" }],
    reviews: [{ type: String, ref: "Review" }],
    watched: [{ type: Number, ref: "Film" }]
});
//N.B. un film recensito viene aggiunto sia in reviews che in watched (non il contrario)
//watched contiene coppie di filmID e rating inserito. se il film viene visto ma non recensito, il rating è 0.

//required:true indica che il campo è obbligatorio
//unique:true indica che il valore di quel campo è uniquo in tutti i documenti della collezione (non ci possono essere più utenti
//con la stessa email o nome utente)

const User = mongoose.model('User', userSchema);

module.exports = User;