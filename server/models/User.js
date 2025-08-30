const mongoose = require('mongoose');
//utilizziamo l'associazione tramite riferimento e non tramite embedding per rendere lo sviluppo futuro della web app più scalabile
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchlist: [{ type: Number, ref: "Film" }]  //invece di aggiungere gli oggetti film in watchlist, aggiungo solo il loro id (infatti type è Number, lo stesso di id)
});
//required:true indica che il campo è obbligatorio
//unique:true indica che il valore di quel campo è uniquo in tutti i documenti della collezione (non ci possono essere più utenti
//con la stessa email o nome utente)
const User = mongoose.model('User', userSchema);

module.exports = User;