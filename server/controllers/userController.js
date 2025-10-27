const User = require("../models/User");
const Activity = require("../models/Activity");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

function timeAgo(past) {
    const now = new Date();
    const diffMs = now - past; //differenza di tempo calcolata in millisecondi

    if (diffMs < 0) return null;

    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30; // approssimato

    if (diffMs < minute) return "1m";
    if (diffMs < hour) {
        const minutes = Math.floor(diffMs / minute);
        return `${minutes}m`;
    }
    if (diffMs < day) {
        const hours = Math.floor(diffMs / hour);
        return `${hours}h`;
    }
    if (diffMs < week) {
        const days = Math.floor(diffMs / day);
        return `${days}d`;
    }
    if (diffMs < month) {
        const weeks = Math.floor(diffMs / week);
        return `${weeks}w`;
    }
    const months = Math.floor(diffMs / month);
    if(months === 1 ) {
        return `${months}mo`;
    }else return null;
    }

exports.modifyPassword = async (req, res) => {
    try{
        const {oldPassword, newPassword, confirmNewPassword} = req.body;
        const user = await User.findById(req.user.id);

        //controllo che la "vecchia password" corrisponda a quella dell'utente
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json("La vecchia password non è corretta. ")

        //dopodichè controllo che la nuova password e la sua conferma siano uguali
        if (newPassword !== confirmNewPassword) return res.status(400).json( 'Le password non corrispondono.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

        res.status(200).json('Password aggiornata con successo.');
    }catch(error){ res.status(500).json("Errore interno del server."); }

}

exports.getProfileInfo = async (req, res) => {
    try{
        const username = req.params.username;
        const user = await User.findOne({ username: username }).populate('favorites').populate('watched').populate({path: 'reviews', populate: {path: 'film'}});
        const profile = {
            avatar_path: user.avatar_path,
            country: user.country,
            biography: user.biography,
            followers: user.followers.length,
            following: user.following.length,
            favorites: user.favorites.length > 0 ? user.favorites.reverse() : null,
            latestWatched: user.watched.length > 0 ? user.watched.reverse().slice(0, 10) : null,
            latestReviews: user.reviews.length > 0 ? user.reviews.slice(0, 10) : null
        }
        res.status(200).json(profile);

    }catch(error){ res.status(500).json("Errore interno del server."); }
}

exports.getFollowing = async (req, res) => {
    try{
        const username = req.params.username;
        const user = await User.findOne({ username: username }).populate('following');
        res.status(200).json(user.following);
    }catch(error){ res.status(500).json("Errore interno del server."); }
}

exports.getFollowers = async (req, res) => {
    try{
        const username = req.params.username;
        const user = await User.findOne({username: username}).populate('followers');
        res.status(200).json(user.followers);
    }catch(error){ res.status(500).json("Errore interno del server."); }

}

exports.deleteAccount = async (req, res) => {
    try{
        const userID = req.user.id;
        let confirmEmail = req.params.confirmEmail;

        const user = await User.findById(userID);
        if (user.email !== confirmEmail) return res.status(400).json("L'email inserita non corrisponde a quella del tuo account. Riprova.");

        await User.findByIdAndDelete(userID);

        res.status(200).json("Account eliminato con successo." );
    }catch(error){ res.status(500).json("Errore interno del server."); }
}

exports.getProfileData = async (req, res) => {
    try{
        const userID = req.user.id;
        const user = await User.findById(userID);
        let profileData = {
            username: user.username ? user.username : "",
            email: user.email ? user.email : "",
            name: user.name ? user.name : "",
            surname: user.surname ? user.surname : "",
            biography: user.biography ? user.biography : "",
            country: user.country ? user.country : "",
        }
        res.status(200).json(profileData);
    }catch(error){ res.status(500).json("Errore interno del server."); }
}

exports.updateProfile = async (req, res) => {
    try{
        const userID = req.user.id;
        const profileData = req.body;

        await User.findByIdAndUpdate(userID,
            { $set: {
                    username: profileData.username,
                    email: profileData.email,
                    name: profileData.name,
                    surname: profileData.surname,
                    biography: profileData.biography,
                    country: profileData.country

                } },
            {
                runValidators: true //esegue le validazioni dello schema (es. unique)
            }
        )
        res.status(200).json("Profilo aggiornato.")
    }catch(error){ res.status(500).json("Errore interno del server."); }
}

exports.getActivity = async (req, res) => {
    try{
        const username = req.params.username;
        //popolo la proprietà activity e per ogni oggetto che ottengo popolo anche la proprietà user
        const user = await User.findOne({ username: username}).populate({
            path: "activity",
            populate: { path: "user" }
        });

        user.activity = user.activity.filter( action => timeAgo(action.date) !== null ) //filtro per tutte le attività fino ad un mese fa
        let activity = user.activity.map( action => { return{...action.toObject(), timeAgo: timeAgo(action.date)} });
        res.status(200).json(activity.reverse());
    }catch(error){ res.status(500).json("Errore interno del server."); }
}

exports.follow = async (req, res) => {
    try{
        const userID = req.user.id;
        const friendUsername = req.params.friendUsername;

        const user = await User.findById(userID);
        if(!user) return res.status(404).json("Utente non trovato.");

        const friend = await User.findOne({ username: friendUsername });

        //controllo prima che il nome utente esista
        if(!friend) return res.status(404).json("Nome utente non esistente.");
        let friendID = friend._id.toString();

        //controllo che l'utente non stia seguendo se stesso
        if (userID === friendID) return res.status(400).json("Non puoi seguire te stesso.");

        //controllo che l'utente non stia già seguendo l'amico
        if(user.following.find(id => id === friendID)) return res.status(404).json(`Segui già "${friendUsername}"`);

        await User.findByIdAndUpdate(userID, { $addToSet: { following: friendID } });

        await User.findByIdAndUpdate(friendID, { $addToSet: { followers: userID } });

        res.status(200).json("Amico aggiunto con successo.");
    }catch(error){ res.status(500).json("Errore interno del server."); }
}

exports.unfollow = async (req, res) => {
    try{
        const userToUnfollowID = req.params.userId;
        const userID = req.user.id; //id dell'utente che ha richiesto l'unfollow
        await User.findByIdAndUpdate(userToUnfollowID, {$pull: {follower: userID }} );
        await User.findByIdAndUpdate(userID, { $pull: {following: userToUnfollowID} } );
        res.status(200).json("Rimozione avvenuta correttamente");
    }catch(error){ res.status(500).json("Errore interno del server."); }
}