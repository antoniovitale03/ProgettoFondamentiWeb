const Film = require("../models/Film");
const User = require("../models/User");
require("dotenv").config();

exports.addToWatched = async (req, res) => {
    try{
        const userID = req.user.id;
        const { film } = req.body;
        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                _id: film.id,
                title: film.title,
                release_year: film.release_year,
                director: film.director,
                poster_path: film.poster_path,
                date: new Date().toLocaleDateString("it-IT", {year: 'numeric', month: 'long', day: 'numeric'})
            },
            {
                upsert: true
            }
        )
        //se ho visto un film eventualmente va rimosso dalla watchlist
        await User.findByIdAndUpdate(userID, {
            $addToSet: { watched: film.id },
            $pull: {watchlist: film.id}
        })

        res.status(200).json({ message: `"${film.title}" aggiunto alla lista dei film visti!`  });
    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}

exports.removeFromWatched = async (req, res) => {
    try{
        const userID = req.user.id;
        const filmID = parseInt(req.params.filmID);

        const user = await User.findById(userID);
        user.watched = user.watched.find(id => id !== filmID);
        await user.save()
    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
    res.status(200).json("Film rimosso da quelli visti")
}

exports.getWatched = async (req, res) => {
    const userID = req.user.id;
    const user = await User.findById(userID).populate('watched').populate('reviews');
    //per ogni film visto controllo se è stato anche piaciuto e il suo rating
    let watchedFilms = user.watched.map( (watchedFilm) => {
        let isLiked = user.liked.find( (likedFilm) => likedFilm === watchedFilm._id)//controllo se il film è anche piaciuto
        isLiked = isLiked === undefined ? false : true;
        let review = user.reviews.find( (review) => review._id === watchedFilm._id) // trovo la recensione (se esiste)
        let rating = review !== undefined ? review.rating : null;
        return {...watchedFilm._doc,
            director: null, //nella pagina dei film visti non mostro il regista di ogni film
            isLiked: isLiked,
            rating: rating,
        }
    })
    res.status(200).json(watchedFilms);
}