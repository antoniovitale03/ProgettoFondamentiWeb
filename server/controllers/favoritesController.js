const User = require("../models/User");
const Film = require("../models/Film");
const Activity = require("../models/Activity");

exports.addToFavorites = async (req, res) => {
    try{
        const userID = req.user.id;
        let { film } = req.body;

        const user = await User.findById(userID);
        let avatar = user.avatar_path;

        //controllo che venga rispettato il limite di 10 film preferiti
        if (user.favorites.length >= 10){
            return res.status(500).json("Impossibile aggiungere il film. Hai superato il limite di 10 film nei preferiti");
        }

        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                $set: {
                    title: film.title,
                    release_year: film.release_year,
                    director: film.director,
                    poster_path: film.poster_path
                }
            },
            {
                upsert: true
            });

        //aggiungo l'azione alle attività
        const newActivity = new Activity({
            username: req.user.username,
            avatar: avatar,
            filmID: film.id,
            filmTitle: film.title,
            action: 'ADD_TO_FAVORITES',
            date: new Date().toLocaleDateString("it-IT", {year: 'numeric', month: 'long', day: 'numeric'})
        })

        await newActivity.save();

        await User.findByIdAndUpdate(
            userID,
            { $addToSet: { favorites: film.id, activity: newActivity._id } }
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
        let favorites = user.favorites.map( (film) => {
            return {...film._doc, rating: null, date: null}
        })
        favorites = await Promise.all(favorites);
        res.status(200).json(favorites);

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}

