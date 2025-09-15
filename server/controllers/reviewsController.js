const Review = require("../models/Review");
const User = require("../models/User");
const Film = require("../models/Film");
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
        const {title, release_year, review, reviewRating} = req.body;
        const userID = req.user.id;
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY_TMDB}&query=${title}`);
        const data = await response.json();
        let films = data.results;
        if (!films) {
            return res.status(400).json("Nessun film trovato." );
        }
        //trovo il film che corrisponde alla data di uscita che ho inserito, sempre se è corretta
        let film = films.find((film) => new Date(film.release_date).getFullYear() === release_year);
        if (!film) {
            return res.status(400).json("Nessun film trovato.");
        }

        //il film è stato trovato, quindi modifico l'url per mostrare la locandina

        await Review.findOneAndUpdate(
            { _id: film.id }, // Condizione di ricerca
            //se non esiste crea un nuovo oggetto film nella collezione films:
            {
                _id: film.id,
                title: film.title,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl,
                release_year: release_year,
                review: review,
                rating: reviewRating,
                review_date: new Date().toLocaleDateString("it-IT", {year: 'numeric', month: 'long', day: 'numeric'})
            },
            {
                upsert: true // Se il documento non esiste sulla base del filtro, ne crea uno nuovo sulla base di update
            }
        );
        //siccome un film recensito corrisponde ad un film già visto dall'utente, lo inserisco anche nella lista dei film visti
        await User.findByIdAndUpdate(userID, {
            $addToSet: {
                reviews: film.id,
                watched: film.id
            }
        });
        //e aggiungo il rating (dovengo aggiungere un'oggetto film devo calcolare il regista)
        const director = await getFilmDirector(film.id); //oppure film.id

        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                _id: film.id,
                title: film.title,
                release_date: release_year,
                director: director,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl,
            },
            {
                upsert: true
            }
        )

        res.status(200).json(`Recensione di "${film.title}" salvata correttamente!`);
    }catch(error){
        console.log(error)
        res.status(500).json("Errore interno del server.");
    }


}

exports.deleteReview = async (req, res) => {
    try{
        const userID = req.user.id;
        const filmID = parseInt(req.params.filmID);
        const user = await User.findById(userID)

        user.reviews = user.reviews.filter(id => id !== filmID);
        await user.save();

        await Review.findOneAndDelete( {_id: filmID} );

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
    res.status(200).json("Recensione rimossa")
}

exports.getReviews = async (req, res) => {
    try{
        const userID = req.user.id;
        let user = await User.findById(userID).populate('reviews');
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato." });
        }

        let reviews = user.reviews.map( review => {
            return {...review._doc}
        })

        res.status(200).json(reviews);

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}
