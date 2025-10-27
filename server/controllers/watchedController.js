const Film = require("../models/Film");
const User = require("../models/User");
const Activity = require("../models/Activity");

exports.addToWatched = async (req, res) => {
    try{
        const userID = req.user.id;
        const { film } = req.body;
        const user = await User.findById(userID);

        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                $setOnInsert:
                    {   title: film.title,
                        release_year: film.release_year,
                        director: film.director,
                        poster_path: film.poster_path,
                        popularity: film.popularity,
                        genres: film.genres,
                        date: new Date().toLocaleDateString("it-IT", {year: 'numeric', month: 'long', day: 'numeric'})
                    }
            },
            {
                upsert: true
            }
        )

        const newActivity = await Activity.create({
            user: userID,
            filmID: film.id,
            filmTitle: film.title,
            action: 'ADD_TO_WATCHED',
            date: Date.now()
        });

        //se ho visto un film eventualmente va rimosso dalla watchlist
        await User.findByIdAndUpdate(userID, {
            $addToSet: { watched: film.id, activity: newActivity._id },
            $pull: { watchlist: film.id }
        })

        await User.updateMany(
            {_id: {$in: user.followers}},
            {$addToSet: { activity: newActivity._id }}
        )

        res.status(200).json(`"${film.title}" aggiunto alla lista dei film visti!`);
    }catch(error){ res.status(500).json("Errore interno del server."); }
}

exports.removeFromWatched = async (req, res) => {
    try{
        const filmID = parseInt(req.params.filmID);
        await User.findByIdAndUpdate(req.user.id, { $pull: { watched: filmID } });
        res.status(200).json("Film rimosso da quelli visti");
    }catch(error){ res.status(500).json("Errore interno del server."); }
}

exports.getWatched = async (req, res) => {
    try{
        const username = req.params.username;
        const { genre, decade, minRating, sortByDate, sortByPopularity, isLiked } = req.query;

        const user = await User.findOne({ username: username }).populate('watched').populate('reviews');

        //per ogni film visto controllo se è stato anche piaciuto e il suo rating (di default mostro dal più recente)
        let watchedFilms = user.watched.reverse().map( film => {
            let review = user.reviews.find( review => review.film === film._id); // trovo la recensione (se esiste)
            return {...film.toObject(),
                isLiked: user.liked.some( likedFilmId => likedFilmId === film._id), //controllo se il film è anche piaciuto
                rating: review !== undefined ? review.rating : null,
            }
        })

        let filteredFilms = watchedFilms
            .filter( film => !genre || film.genres.some(g => g.id === parseInt(genre)))
            .filter( film => !decade || film.release_year >= parseInt(decade) && film.release_year <= parseInt(decade) + 9 )
            .filter( film => !minRating || film.rating >= parseInt(minRating) )
            .filter( film => !isLiked || film.isLiked.toString() === isLiked)

        if(sortByDate) filteredFilms = sortByDate === "Dal meno recente" ? filteredFilms.reverse() : filteredFilms;
        if (sortByPopularity) filteredFilms = sortByPopularity === "Dal più popolare" ? filteredFilms.sort((a,b) => b.popularity - a.popularity) : filteredFilms.sort((a,b) => a.popularity - b.popularity);
        res.status(200).json(filteredFilms);
    }catch(error){ res.status(500).json("Errore interno del server."); }
}