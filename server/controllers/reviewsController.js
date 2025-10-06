const Review = require("../models/Review");
const User = require("../models/User");
const Film = require("../models/Film");
const Activity = require("../models/Activity");
require("dotenv").config();


async function getFilmDirector(filmID) {
    // Chiamata usata per ottenere il cast (tutti gli attori) e la crew (regista, sceneggiatore, scrittore, ...), più
    //utile per ottenere solo
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY_TMDB}`);
    const credits = await creditsResponse.json();

    // 3. Trova il regista nell'array 'crew'
    const directorObject = credits.crew.find( (member) => member.job === 'Director');

    // 4. Estrai il nome (gestendo il caso in cui non venga trovato)
    const director = directorObject ? {name: directorObject.name, id:directorObject.id} : null;
    return director;
}

exports.addReview = async (req, res) => {
    try{
        const {film, review, reviewRating} = req.body;
        const userID = req.user.id;
        const user = await User.findById(userID);
        if (!user) {
            return res.status(400).send("Utente non trovato.");
        }

        //il film è stato trovato, quindi modifico l'url per mostrare la locandina
        const newReview = await new Review(
            {
                film: film.id,
                review: review,
                rating: reviewRating,
                review_date: new Date().toLocaleDateString("it-IT", {year: 'numeric', month: 'long', day: 'numeric'})
            }
        )
        await newReview.save();

        //aggiungo l'azione alle attività
        const newActivity = new Activity({
            user: userID,
            filmID: film.id,
            filmTitle: film.title,
            action: 'ADD_REVIEW',
            rating: reviewRating,
            date: new Date().toLocaleDateString("it-IT", {year: 'numeric', month: 'long', day: 'numeric'})
        })

        await newActivity.save();

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
                    release_date: film.release_year,
                    director: director,
                    poster_path: film.poster_path,
                }},
            {
                upsert: true
            }
        )

        res.status(200).json(`Recensione di "${film.title}" salvata correttamente!`);
    }catch(error){
        res.status(500).json("Errore interno del server.");
    }

}

exports.deleteReview = async (req, res) => {
    try{
        const userID = req.user.id;
        const filmID = parseInt(req.params.filmID);

        const user = await User.findById(userID).populate({
            path: "reviews",
            populate: { path: "film" }
        });
        if (!user) {
            return res.status(404).json("Utente non trovato.");
        }

        //trovo l'oggetto Recensione che voglio eliminare e ne calcolo l'id
        let reviewObJ = user.reviews.find( review => review.film._id === filmID);
        let reviewID = reviewObJ._id;

        user.reviews = user.reviews.filter(id => id !== reviewID);
        await user.save();

        await Review.findOneAndDelete( {_id: reviewID} );
        res.status(200).json("Recensione rimossa");

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }

}

exports.getReviews = async (req, res) => {
    try{
        const username = req.params.username;
        const { genre, decade, minRating, sortByDate, sortByPopularity } = req.query;

        let user = await User.findOne({ username: username}).populate({
            path: "reviews",
            populate: { path: "film" }
        });
        if (!user) {
            return res.status(404).json("Utente non trovato.");
        }

        let reviews = user.reviews.reverse();
        console.log(reviews);
        if(genre){
            reviews = reviews.filter(review => review.film.genres.some(g => g.id === parseInt(genre)) );
        }
        if(decade){
            reviews = reviews.filter( review => review.film.release_year >= parseInt(decade) && review.film.release_year <= parseInt(decade) + 9 );
        }
        if(minRating){
            reviews = reviews.filter(review => review.rating >= parseInt(minRating));
        }
        if(sortByDate){
            reviews = sortByDate === "Dal meno recente" ? reviews.reverse() : reviews;
        }
        if(sortByPopularity){
            reviews = reviews.sort()
        }

        res.status(200).json(reviews);
    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}
