const Film = require('../models/Film');
const User = require('../models/User');
const Activity = require("../models/Activity");


exports.addToWatchlist = async (req, res) => {
    try{
        const userID = req.user.id;
        let { film } = req.body;
        const user = await User.findById(userID);

        await Film.findOneAndUpdate(
            { _id: film.id }, // Condizione di ricerca
            { $setOnInsert: {
                    title: film.title,
                    release_year: film.release_year,
                    director: film.director,
                    poster_path: film.poster_path,
                    popularity: film.popularity,
                    genres: film.genres
                }},
            {
                upsert: true // Se il documento non esiste sulla base del filtro, ne crea uno nuovo sulla base di update
            }
        );

        const newActivity = await Activity.create({
            user: userID,
            filmID: film.id,
            filmTitle: film.title,
            action: 'ADD_TO_WATCHLIST',
            date: Date.now()
        })

        await User.findByIdAndUpdate(
            userID,
            { $addToSet: { watchlist: film.id, activity: newActivity._id }
            })

        //l'attività va aggiunta anche a tutti gli amici che mi seguono
        //aggiorno simultaneamente tutti gli utenti con _id contenuti nella lista user.following
        await User.updateMany(
            {_id: {$in: user.followers}},
            { $addToSet: { activity: newActivity._id }}
        )

        res.status(200).json(`"${film.title}" aggiunto alla watchlist!`);
    }catch(error){ res.status(500).json("Errore interno del server") }
}

exports.removeFromWatchlist = async (req, res) => {
    try{
        const filmID = parseInt(req.params.filmID);
        await User.findByIdAndUpdate(req.user.id, { $pull: {watchlist: filmID} });
        res.status(200).json("Film eliminato dalla watchlist");
    }catch(error){ res.status(500).json("Errore interno del server."); }
}

exports.getWatchlist = async (req, res) => {
    try{
        const username = req.params.username;
        const { genre, decade, minRating, sortByDate, sortByPopularity } = req.query;

        let user = await User.findOne({ username: username }).populate('watchlist');
        if (!user) return res.status(404).json("Utente non trovato.");

        let watchlist = user.watchlist.reverse();

        let filteredFilms = watchlist
            .filter( film => !genre || film.genres.some(g => g.id === parseInt(genre)))
            .filter( film => !decade || film.release_year >= parseInt(decade) && film.release_year <= parseInt(decade) + 9 )
            .filter( film => !minRating || film.rating >= parseInt(minRating) )

        if(sortByDate) filteredFilms = sortByDate === "Dal meno recente" ? filteredFilms.reverse() : filteredFilms;
        if (sortByPopularity) filteredFilms = filteredFilms.sort((a,b) => b.popularity - a.popularity);
        res.status(200).json(filteredFilms);
    }catch(error){ res.status(500).json("Errore interno del server."); }
}