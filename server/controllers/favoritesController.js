const User = require("../models/User");
const Film = require("../models/Film");
require('dotenv').config();

exports.addToFavorites = async (req, res) => {
    try{
        const userID = req.user.id;
        let {film} = req.body;

        //controllo che venga rispettato il limite di 10 film preferiti
        const user = await User.findById(userID)
        if (user.favorites.length >= 10){
            return res.status(500).json("Impossibile aggiungere il film. Hai superato il limite di 10 film nei preferiti");
        }

        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                _id: film.id,
                title: film.title,
                release_year: film.release_year,
                director: film.director,
                poster_path: film.poster_path,
            },
            {
                upsert: true
            });
        await User.findByIdAndUpdate(
            userID,
            { $addToSet: { favorites: film.id } }
        )
        res.status(200).json(`"${film.title}" aggiunto alla lista dei favoriti!`);

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}

exports.removeFromFavorites = async (req, res) => {
    try{
        const userID = req.user.id;
        const filmID = parseInt(req.params.filmID);

        const user = await User.findById(userID);
        user.favorites = user.favorites.filter(id => id !== filmID);

        await user.save();

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
    res.status(200).json("Film rimosso dai preferiti")
}

exports.getFavorites = async (req, res) => {
    try{
        const userID = req.user.id;
        const user = await User.findById(userID).populate('favorites');
        if(!user) {
            return res.status(404).json({ message: "Utente non trovato." });
        }
        let favorites = user.favorites.map( async (film) => {
            return {...film._doc, rating: null, date: null}
        })
        favorites = await Promise.all(favorites);
        res.status(200).json(favorites);

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}

