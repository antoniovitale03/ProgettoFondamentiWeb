const User = require("../models/User");
const Film = require("../models/Film");
const Activity = require("../models/Activity");

exports.addToFavorites = async (req, res) => {
    try{
        const userID = req.user.id;
        let { film } = req.body;

        const user = await User.findById(userID);

        if (user.favorites.length >= 10) return res.status(500).json("Impossibile aggiungere il film. Hai superato il limite di 10 film nei preferiti");

        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                $setOnInsert: {
                    title: film.title,
                    release_year: film.release_year,
                    director: film.director,
                    poster_path: film.poster_path,
                    popularity: film.popularity,
                    genres: film.genres
                }
            },
            {
                upsert: true
            });

        //aggiungo l'azione alle attività
        const newActivity = await Activity.create({
            user: userID,
            filmID: film.id,
            filmTitle: film.title,
            action: 'ADD_TO_FAVORITES',
            date: Date.now()
        });

        await User.findByIdAndUpdate(
            userID,
            { $addToSet: { favorites: film.id, activity: newActivity._id } }
        )

        await User.updateMany( {_id: {$in: user.followers}}, {$addToSet: { activity: newActivity._id }});

        res.status(200).json(`"${film.title}" aggiunto alla lista dei favoriti!`);
    }catch(error){ res.status(500).json("Errore interno del server."); }
}

exports.removeFromFavorites = async (req, res) => {
    try{
        const filmID = parseInt(req.params.filmID);
        await User.findByIdAndUpdate(req.user.id, { $pull: { favorites: filmID } });
        res.status(200).json("Film rimosso dai preferiti");
    }catch(error){ res.status(500).json("Errore interno del server."); }

}

exports.getFavorites = async (req, res) => {
    try{
        const username = req.params.username;
        const user = await User.findOne({ username: username }).populate('favorites');
        if(!user) return res.status(404).json("Utente non trovato.");
        res.status(200).json(user.favorites.reverse());
    }catch(error){ res.status(500).json("Errore interno del server."); }
}

