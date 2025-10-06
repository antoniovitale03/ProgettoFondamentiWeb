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
                $set:
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

        //aggiungo l'azione alle attività
        const newActivity = new Activity({
            user: userID,
            filmID: film.id,
            filmTitle: film.title,
            action: 'ADD_TO_WATCHED',
            date: new Date().toLocaleDateString("it-IT", {year: 'numeric', month: 'long', day: 'numeric'})
        })

        await newActivity.save();

        //se ho visto un film eventualmente va rimosso dalla watchlist
        await User.findByIdAndUpdate(userID, {
            $addToSet: { watched: film.id, activity: newActivity._id },
            $pull: { watchlist: film.id }
        })

        await User.updateMany(
            {_id: {$in: user.following}},
            {$addToSet: { activity: newActivity._id }}
        )

        res.status(200).json(`"${film.title}" aggiunto alla lista dei film visti!`);
    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}

exports.removeFromWatched = async (req, res) => {
    try{
        const userID = req.user.id;
        const filmID = parseInt(req.params.filmID);

        const user = await User.findById(userID);

        user.watched = user.watched.filter(id => id !== filmID);
        await user.save();

        res.status(200).json("Film rimosso da quelli visti");

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}

exports.getWatched = async (req, res) => {
    const username = req.params.username;
    const { genre, decade, minRating, sortByDate, sortByPopularity, isLiked } = req.query;

    const user = await User.findOne({ username: username }).populate('watched').populate('reviews');

    //per ogni film visto controllo se è stato anche piaciuto e il suo rating
    let watchedFilms = user.watched.reverse().map( watchedFilm => {
        let isLiked = user.liked.some( likedFilmId => likedFilmId === watchedFilm._id);//controllo se il film è anche piaciuto
        //uso some perchè mi serve il valore booleano (find restituisce l'elemento)

        let review = user.reviews.find( review => review.filmID === watchedFilm._id); // trovo la recensione (se esiste)
        return {...watchedFilm.toObject(),
            isLiked: isLiked,
            rating: review !== undefined ? review.rating : null,
        }
    })
    //se la ricerca senza filtri non da risultati (array vuoto), significa che non ho ancora visto nessun film
    if (genre === "" && decade === "" && minRating === 0 && sortByDate === "" && sortByPopularity === "" && isLiked === null && watchedFilms.length === 0) {
        return res.status(400).json("Non hai ancora visto nessun film!");
    }

    //Una volta che ottengo tutti i film visti, posso filtrare i risultati in base ai parametri
    if(genre){
        watchedFilms = watchedFilms.filter(film => film.genres.some(g => g.id === parseInt(genre)) )
    }

    if(decade){
        watchedFilms = watchedFilms.filter( film => film.release_year >= parseInt(decade) && film.release_year <= parseInt(decade) + 9 )
    }

    if(sortByDate){
        watchedFilms = sortByDate === "Dal più recente" ? watchedFilms.reverse() : watchedFilms
    }

    if (sortByPopularity){
        watchedFilms = watchedFilms.sort((a,b) => b.popularity - a.popularity);
    }

    if(minRating){
        watchedFilms = watchedFilms.filter( film => film.rating >= parseInt(minRating))
    }

    if(isLiked) {
        watchedFilms = watchedFilms.filter(film => film.isLiked.toString() === isLiked)
    }

    if(watchedFilms.length === 0){
        res.status(400).json("Nessun risultato");
    }else{
        res.status(200).json(watchedFilms);
    }

}