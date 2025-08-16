const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
//required:true indica che il campo è obbligatorio
//unique:true indica che il valore di quel campo è uniquo in tutti i documenti della collezione (non ci possono essere più utenti
//con la stessa email o nome utente)
const User = mongoose.model('User', userSchema);

module.exports = User;