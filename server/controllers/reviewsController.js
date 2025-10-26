const Review = require("../models/Review");
const User = require("../models/User");
const Film = require("../models/Film");
const Activity = require("../models/Activity");
require("dotenv").config();

async function getFilmDirector(filmID) {
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY_TMDB}`);
    const credits = await creditsResponse.json();
    const directorObject = credits.crew.find( (member) => member.job === 'Director');
    return directorObject ? {name: directorObject.name, id: directorObject.id} : null;
}

exports.addReview = async (req, res) => {
    try{
        const {film, review, reviewRating} = req.body;
        const userID = req.user.id;
        const user = await User.findById(userID);
        if (!user) return res.status(400).send("Utente non trovato.");

        const newReview = await Review.create(
            {
                film: film.id,
                review: review,
                rating: reviewRating,
                review_date: new Date().toLocaleDateString("it-IT", {year: 'numeric', month: 'long', day: 'numeric'})
            }
        )

        const newActivity = await Activity.create({
            user: userID,
            filmID: film.id,
            filmTitle: film.title,
            action: 'ADD_REVIEW',
            rating: reviewRating,
            date: Date.now()
        })

        await User.updateMany(
            {_id: {$in: user.following}},
            {$addToSet: { activity: newActivity._id }}
        )

        //siccome un film recensito corrisponde ad un film già visto dall'utente, lo inserisco anche nella lista dei film visti
        await User.findByIdAndUpdate(userID, {
            $addToSet: {
                reviews: newReview._id,
                watched: film.id,
                activity: newActivity._id
            }
        });

        //e aggiungo il rating (dovengo aggiungere un'oggetto film devo calcolare il regista)
        const director = await getFilmDirector(film.id); //oppure film.id

        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                $set: {
                    title: film.title,
                    release_year: film.release_year,
                    director: director,
                    poster_path: film.poster_path,
                    genres: film.genres
                }},
            {
                upsert: true
            }
        )

        res.status(200).json(`Recensione di "${film.title}" salvata correttamente!`);
    }catch(error){ res.status(500).json("Errore interno del server."); }

}

exports.deleteReview = async (req, res) => {
    try{
        const userID = req.user.id;
        const filmID = parseInt(req.params.filmID);

        const review = await Review.findOne({ film: filmID, user: userID });
        if (review) await User.updateOne(userID, {$pull: { reviews: review._id }} );

        await Review.findOneAndDelete( {_id: review._id} );
        res.status(200).json("Recensione rimossa");

    }catch(error){ res.status(500).json("Errore interno del server."); }
}

exports.getReviews = async (req, res) => {
    try{
        const username = req.params.username;
        const { genre, decade, minRating, sortByDate, sortByPopularity } = req.query;

        let user = await User.findOne({ username: username }).populate({
            path: "reviews",
            populate: { path: "film" }
        });
        if (!user) return res.status(404).json("Utente non trovato.");

        let reviews = user.reviews.reverse();

        let filtered_reviews = reviews
            .filter(review => !genre || review.film.genres.some(g => g.id === parseInt(genre))  )
            .filter(review => !decade || review.film.release_year >= parseInt(decade) && review.film.release_year <= parseInt(decade) + 9  )
            .filter(review => !minRating || review.rating >= parseInt(minRating) )

        if(sortByDate) filtered_reviews = sortByDate === "Dal meno recente" ? reviews.reverse() : filtered_reviews;
        if(sortByPopularity === "Dal più popolare") filtered_reviews = filtered_reviews.sort( (a,b) => a.film.popularity - b.film.popularity );
        if(sortByPopularity === "Dal meno popolare") filtered_reviews = filtered_reviews.sort( (a,b) => b.film.popularity - a.film.popularity );
        res.status(200).json(filtered_reviews);
    }catch(error){ res.status(500).json("Errore interno del server."); }
}
