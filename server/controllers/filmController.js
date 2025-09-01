require('dotenv').config();
const Film = require('../models/Film');
const User = require('../models/User');
const Review = require('../models/Review');

async function getFilmDirector(filmID) {
    // 2. Chiamata per il cast (tutti gli attori) e la crew (regista, sceneggiatore, scrittore, ...)
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY_TMDB}`);
    const credits = await creditsResponse.json();

    // 3. Trova il regista nell'array 'crew'
    const directorObject = credits.crew.find( (member) => member.job === 'Director');

    // 4. Estrai il nome (gestendo il caso in cui non venga trovato)
    const director = directorObject ? directorObject.name : null;
    return director;
}

//ottieni i risultati di ricerca di un film (array di oggetti film)
//N.B per ogni film mostro solo locandina, titolo, data di uscita e regista
exports.getFilmsFromSearch = async (req, res) => {
    const { title } = req.body;
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY_TMDB}&query=${title}`);
    const data = await response.json();
    let films = data.results; //ottengo la lista di tutti i film che corrispondono alla ricerca
    //aggiungo ad ogni film la proprietà che riguarda il regista, completo l'url per locandina e sfondo (se esistono) e
    //converto release_date indicando solo l'anno di uscita senza mese e giorno
    films = films.map(async (film) => {  //array di Promise
        const director = await getFilmDirector(film.id);
        const poster_image_url = film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
        const year = film.release_date ? new Date(film.release_date).getFullYear() : "N/A";
        return {
            title: film.title,
            id: film.id,
            director: director,
            poster_path: poster_image_url,
            release_date: year,
        };
    });

    films = await Promise.all(films);
    res.status(200).json(films);
}

//questa funzione serve per trovare un film conoscendo il suo ID di tmdb e il suo titolo, restituendo tutte le informazioni che
//dovranno essere mostrate nella filmPage
exports.getFilm = async (req, res) => {
    const filmTitle = req.params.filmTitle;
    const filmID = parseInt(req.params.filmID);
    const response = await fetch(`https://api.themoviedb.org/3/movie/${filmID}?api_key=${process.env.API_KEY_TMDB}&query=${filmTitle}`);
    let film = await response.json();
    //aggiungo il regista e modifico la data d'uscita
    const director = await getFilmDirector(filmID); //oppure film.id
    const year = film.release_date ? new Date(film.release_date).getFullYear() : "N/A";
    film = {...film,
        director: director,
        release_date: year,
        poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl,
        backdrop_path: film.backdrop_path ? process.env.bannerBaseUrl + film.backdrop_path : process.env.greyPosterUrl
    }
    res.status(200).json(film);
}

//il server verifica se il film esiste già nella collezione films e se non esiste lo crea.
// Questo garantisce di avere sempre una sola copia dei dati di ogni film.
// Dopodichè aggiunge l'ID di quel film all'array watchlist dell'utente, ma solo se non è già presente per evitare duplicati. (associazione tramite riferimento)
// N.B. usato id nell'api tmdb e _id in mongodb, in modo da poter effettuare populate()
exports.addToWatchlist = async (req, res) => {
    try{
        const userID = req.user.id;
        let { film } = req.body;

        const director = await getFilmDirector(film.id);

        //il server verifica se il film esiste già nella collezione films verificando l'id, se non esiste lo crea.
        // questo garantisce di avere sempre una sola copia dei dati di ogni film.

        //findOneandUpdate(filter, update, options)
         await Film.findOneAndUpdate(
            { _id: film.id }, // Condizione di ricerca
            //se non esiste crea un nuovo oggetto film nella collezione films:
            {
                _id: film.id,
                title: film.title,
                release_date: film.release_date,
                director: film.director,
                poster_path: film.poster_path,
            },
            {
                upsert: true // Se il documento non esiste sulla base del filtro, ne crea uno nuovo sulla base di update
            }
        );

        //per aggiungere l'id del film all'array watchlist dell'utente, uso $addToSet che
        // aggiunge un elemento a un array SOLO SE non è già presente (evitare duplicati)
        await User.findByIdAndUpdate(
            userID,
            { $addToSet: { watchlist: film.id }
            }) //con embedding avremmo fatto watchlist: film, aggiungendo l'intero oggetto film

        res.status(200).json({ message: `"${film.title}" aggiunto alla watchlist!`  });
    }catch(error){
        res.status(500).json({ message: "Errore interno del server." });
    }
}

exports.getWatchlist = async (req, res) => {
    try{
        const userID = req.user.id; //prendo l'id dell'utente da req.user fornito dal middleware verifyjwt
        let user = await User.findById(userID).populate('watchlist'); //trova l'utente con quell'id e popola l'array watchlist con i dati
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato." });
        }
        //N.B. le proprietà dei film da mostrare nella pagina watchlist si trovano nella proprietà _doc dell'oggetto film
        let watchlist = user.watchlist.map( (film) => {
                return {...film._doc}}
            )

        // 4. Invia al frontend l'array 'watchlist' che ora contiene gli oggetti film completi, non più solo gli ID
        res.status(200).json(watchlist);

    }catch(error){
        res.status(500).json({ message: "Errore interno del server." })
    }
}

exports.addToFavorites = async (req, res) => {
    try{
        const userID = req.user.id;
        let {film} = req.body;

        //controllo che venga rispettato il limite di 10 film preferiti
        const user = await User.findById(userID)
        if (user.favorites.length >= 10){
            return res.status(500).json({ message: "Impossibile aggiungere il film. Hai superato il limite di 10 film nei preferiti" });
        }

        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                _id: film.id,
                title: film.title,
                release_date: film.release_date,
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
        res.status(200).json({ message: `"${film.title}" aggiunto alla lista dei favoriti!`  });

    }catch(error){
        res.status(500).json({ message: "Errore interno del server." });
    }
}

exports.getFavorites = async (req, res) => {
    try{
        const userID = req.user.id;
        const user = await User.findById(userID).populate('favorites');
        if(!user) {
            return res.status(404).json({ message: "Utente non trovato." });
        }
        let favorites = user.favorites.map( async (film) => {
            return {...film._doc, director: await getFilmDirector(film._id)}
        })
        favorites = await Promise.all(favorites);
        res.status(200).json(favorites);

    }catch(error){
        res.status(500).json({ message: "Errore interno del server." });
    }
}

exports.saveReview = async (req, res) => {
    try{
        const {title, releaseYear, review, rating} = req.body;
        const userID = req.user.id;
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY_TMDB}&query=${title}`);
        const data = await response.json();
        let films = data.results;
        if (!films) {
            return res.status(400).json({ message: "Nessun film trovato." });
        }
        //trovo il film che corrisponde alla data di uscita che ho inserito, sempre se è corretta
        let film = films.find((film) => new Date(film.release_date).getFullYear() === releaseYear);
        if (!film) {
            return res.status(400).json({ message: "Nessun film trovato." });
        }

        //il film è stato trovato, quindi modifico l'url per mostrare la locandina

        await Review.findOneAndUpdate(
            { _id: film.id }, // Condizione di ricerca
            //se non esiste crea un nuovo oggetto film nella collezione films:
            {
                _id: film.id,
                title: film.title,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl,
                release_year: releaseYear,
                review: review,
                rating: rating,
                review_date: new Date().toLocaleDateString("it-IT", {year: 'numeric', month: 'long', day: 'numeric'})
            },
            {
                upsert: true // Se il documento non esiste sulla base del filtro, ne crea uno nuovo sulla base di update
            }
        );

        await User.findByIdAndUpdate(userID, {
            $addToSet: { reviews: film.id }
        });

        res.status(200).json({ message: `Recensione di "${film.title}" salvata correttamente!`  });
        }catch(error){
            res.status(500).json({ message: "Errore interno del server." });
    }


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
        res.status(500).json({ message: "Errore interno del server." });
    }
}

//funzione che permette di ottenere il rating del film inserito dall'utente durante la recensione
exports.getRating = async(req, res) => {
    try{
        const userID = req.user.id;
        const filmID = parseInt(req.params.filmID);
        let user = await User.findById(userID).populate('reviews');
        let review = user.reviews.find( (review) => review._id === filmID)
        if (!review){
            return res.status(200).json(0);
        }
        res.status(200).json(review.rating);
    }catch(error){
        res.status(500).json({ message: "Errore interno del server." });
    }
}

exports.addToLiked = async (req, res) => {
    try{
        const userID = req.user.id;
        let { film } = req.body;

        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                _id: film.id,
                title: film.title,
                release_date: film.release_date,
                director: film.director,
                poster_path: film.poster_path
            },
            {
                upsert: true
            });

        await User.findByIdAndUpdate(userID, {
            $addToSet: { liked: film.id }
        })

        res.status(200).json({ message: `"${film.title}" aggiunto alla lista dei film piaciuti!`  });
    }catch(error){
        res.status(500).json({ message: "Errore interno del server." });
    }
}

exports.addToWatched = async (req, res) => {
    try{
        const userID = req.user.id;
        const { film } = req.body;
        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                _id: film.id,
                title: film.title,
                release_date: film.release_date,
                director: film.director,
                poster_path: film.poster_path,
            },
            {
                upsert: true
            }
        )

        await User.findByIdAndUpdate(userID, {
            $addToSet: { watched: film.id }
        })

        res.status(200).json({ message: `"${film.title}" aggiunto alla lista dei film visti!`  });
    }catch(error){
        res.status(500).json({ message: "Errore interno del server." });
    }
}