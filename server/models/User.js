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
    avatar_path: { type: String },
    refreshToken: { type: String },
    watchlist: [{ type: Number, ref: "Film" }],
    liked: [{ type: Number, ref: "Film" }],
    favorites: [{ type: Number, ref: "Film" }],
    reviews: [{ type: String, ref: "Review" }],
    watched: [{ type: Number, ref: "Film" }],
    lists: [{type: String, ref: "List"}],
    activity: [{ type: String, ref: "Activity" }],
    //proprietà che fanno self-reference
    following: [{ type: String, ref: "User" }],
    followers: [{ type: String, ref: "User" }],
});


const User = mongoose.model('User', userSchema);

module.exports = User;